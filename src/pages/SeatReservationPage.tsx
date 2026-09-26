import React, { useEffect, useMemo, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { supabase } from '../lib/supabase';
import { 
  Armchair, 
  Zap, 
  Sun, 
  Volume2, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';

interface SeatConfig {
  id: string;
  number: string;
  section: string;
  seatType: string;
  status: string;
  floor: number;
}

export const SeatReservationPage: React.FC = () => {
  const { reservations, reserveSeat, cancelSeatReservation } = useLibrary();

  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:00 AM – 12:00 PM');
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string | null>(null);
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [librarySeats, setLibrarySeats] = useState<SeatConfig[]>([]);
  const [libraryActivity, setLibraryActivity] = useState('Reading');

  const timeSlots = [
    '09:00 AM – 12:00 PM',
    '12:00 PM – 03:00 PM',
    '03:00 PM – 06:00 PM',
    '06:00 PM – 09:00 PM'
  ];

  const dateOptions = Array.from({ length: 3 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return {
      label: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Day After',
      sub: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      value: date.toISOString().slice(0, 10)
    };
  });

  const selectedDateValue = dateOptions.find(d => d.label === selectedDate)?.value || dateOptions[0].value;

  useEffect(() => {
    const loadSeats = async () => {
      const { data, error } = await supabase
        .from('library_seats')
        .select('id, seat_number, floor, section, seat_type, status')
        .order('floor')
        .order('seat_number');
      if (!error) setLibrarySeats((data || []).map((seat: any) => ({
        id: seat.id,
        number: seat.seat_number,
        section: seat.section || 'Library',
        seatType: seat.seat_type || 'STANDARD',
        status: seat.status || 'AVAILABLE',
        floor: seat.floor
      })));
    };
    void loadSeats();
  }, []);

  const floors = useMemo(() => Array.from(new Set(librarySeats.map(seat => seat.floor))).sort((a,b) => a-b), [librarySeats]);

  const floorSeats = librarySeats.filter(seat => seat.floor === selectedFloor);

  React.useEffect(() => {
    const loadReservations = async () => {
      const { data } = await supabase
        .from('seat_reservations')
        .select('id, user_id, seat_number, floor, section, reservation_date, time_slot, status')
        .eq('reservation_date', selectedDateValue)
        .eq('floor', selectedFloor)
        .eq('time_slot', selectedTimeSlot)
        .neq('status', 'CANCELLED');
      setAllReservations(data || []);
    };
    void loadReservations();
  }, [selectedDateValue, selectedFloor, selectedTimeSlot]);

  // Calculate status from real database reservations only
  const getSeatStatus = (seatNo: string): 'selected' | 'occupied' | 'reserved' | 'available' => {
    if (selectedSeatNumber === seatNo) return 'selected';

    const dbReservation = allReservations.find(r => r.seat_number === seatNo);
    if (dbReservation) {
      const mine = reservations.some(r => r.id === dbReservation.id);
      return mine ? 'reserved' : 'occupied';
    }
    const seat = floorSeats.find(s => s.number === seatNo);
    return seat?.status === 'BLOCKED' ? 'occupied' : 'available';
  };

  const currentSelectedSeat = floorSeats.find(s => s.number === selectedSeatNumber) || null;

  const handleBooking = async () => {
    if (selectedSeatNumber && currentSelectedSeat) {
      void reserveSeat(
        selectedFloor,
        selectedSeatNumber,
        selectedDate,
        selectedTimeSlot,
        currentSelectedSeat.section
      );
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user && auth.user.id) {
        await supabase.from('library_presence').upsert({
          user_id: auth.user.id,
          table_number: selectedSeatNumber.replace(/^F\d-/, ''),
          activity: libraryActivity,
          status: 'IN_LIBRARY',
          updated_at: new Date().toISOString()
        });
      }
    }
  };

  // Active reservations made by user
  const activeBookings = reservations.filter(r => r.status === 'Confirmed');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-[#4C1D95] uppercase tracking-wider">
          Campus Space Management
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-[#1E293B] tracking-tight mt-0.5">
          Library Seat Reservation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Reserve an ergonomic study carrel, window research desk, or group discussion pod across SIT Central Library floors.
        </p>
      </div>

      {/* Top Filter Controls: Floor, Date, Time Slot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        
        {/* Floor Selection */}
        <div>
          <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
            1. Select Floor
          </label>
          <div className="grid grid-cols-3 gap-2">
            {floors.map(floor => (
                <button
                  key={floor}
                  onClick={() => {
                    setSelectedFloor(floor);
                    setSelectedSeatNumber(null);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${selectedFloor === floor ? 'bg-[#4C1D95] text-white border-[#4C1D95] shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                >
                  Floor {floor}
                </button>
              ))}          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
            2. Select Date
          </label>
          <div className="grid grid-cols-3 gap-2">
            {dateOptions.map(d => (
              <button
                key={d.label}
                onClick={() => setSelectedDate(d.label)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                  selectedDate === d.label
                    ? 'bg-[#4C1D95] text-white border-[#4C1D95] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="block">{d.label}</span>
                <span className="text-[10px] opacity-75 font-normal">{d.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
            3. Time Slot
          </label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95]"
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Seat Map & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Interactive Seat Grid Map */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Floor {selectedFloor} Interactive Floorplan
              </h2>
              <p className="text-xs text-slate-500">Click any green carrel to select and review amenities</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span className="text-slate-600">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-500" />
                <span className="text-slate-600">Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-400" />
                <span className="text-slate-600">Reserved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#4C1D95]" />
                <span className="text-[#1E293B] font-bold">Your Selection</span>
              </div>
            </div>
          </div>

          {/* Front Circulation / Librarian Desk Marker */}
          <div className="w-full py-2 px-4 rounded-xl bg-slate-100 text-center text-xs font-semibold text-slate-500 border border-slate-200 tracking-wider uppercase">
            ▲ Stacks Entrance / Reference Circulation Desk ▲
          </div>

          {/* Seat Grid: 4 columns x 5 rows */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3.5 pt-2">
            {floorSeats.map(seat => {
              const status = getSeatStatus(seat.number);

              let buttonClasses = 'border-slate-300 bg-emerald-50 text-emerald-800 hover:border-emerald-600 hover:scale-105';
              let badgeColor = 'bg-emerald-500';

              if (status === 'selected') {
                buttonClasses = 'bg-[#4C1D95] text-white border-[#4C1D95] ring-2 ring-violet-500 shadow-md scale-105';
                badgeColor = 'bg-[#F97316]';
              } else if (status === 'occupied') {
                buttonClasses = 'bg-rose-50 text-rose-800 border-rose-200 cursor-not-allowed opacity-60';
                badgeColor = 'bg-rose-500';
              } else if (status === 'reserved') {
                buttonClasses = 'bg-amber-50 text-amber-800 border-amber-200 cursor-not-allowed opacity-75';
                badgeColor = 'bg-amber-400';
              }

              return (
                <button
                  key={seat.number}
                  disabled={status === 'occupied' || status === 'reserved'}
                  onClick={() => setSelectedSeatNumber(seat.number)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-between h-20 transition-all duration-200 relative ${buttonClasses}`}
                >
                  <div className="w-full flex items-center justify-between text-[10px]">
                    <span className="font-bold">{seat.number}</span>
                    <span className={`w-2 h-2 rounded-full ${badgeColor}`} />
                  </div>

                  <Armchair className="w-5 h-5 opacity-90 my-auto" />

                  <div className="w-full flex items-center justify-center gap-1 text-[9px] opacity-75">
                    {seat.hasPower && <Zap className="w-2.5 h-2.5" />}
                    {seat.isWindow && <Sun className="w-2.5 h-2.5 text-[#F97316]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 text-center font-tabular">
            Seat availability is synchronized with the library seat inventory and reservation records.
          </div>
        </div>

        {/* Right 1 Col: Selected Seat Details & Booking Action */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Carrel Details
            </h3>
            <div>
              <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">What are you doing?</label>
              <select value={libraryActivity} onChange={e => setLibraryActivity(e.target.value)} className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#1E293B]">
                <option>Reading</option>
                <option>Personal Work</option>
                <option>Research</option>
                <option>Group Study</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Seat Number</span>
                <span className="text-base font-bold text-[#1E293B] font-tabular">
                  {currentSelectedSeat?.number || 'Select a seat'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Floor Level</span>
                <span className="font-semibold text-slate-800">Floor {selectedFloor}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Acoustic Zone</span>
                <span className="font-semibold text-slate-800">{currentSelectedSeat?.section || 'Select a seat to view details'}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#4C1D95]" />
                  <span>230V AC Power Socket {currentSelectedSeat?.hasPower ? 'Available' : 'Nearby'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>{currentSelectedSeat?.isWindow ? 'Direct Window Natural Light' : 'Dual LED Task Lamp'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Strict Silent Study Protocol (&lt; 30dB)</span>
                </div>
              </div>
            </div>

            {/* Time summary */}
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>Selected Date:</strong> {selectedDate}</p>
              <p><strong>Time Slot:</strong> {selectedTimeSlot}</p>
            </div>

            {/* Action button in Coral / Warm Amber (#F97316) */}
            <button
              disabled={!selectedSeatNumber || !currentSelectedSeat || getSeatStatus(selectedSeatNumber) !== 'selected' && getSeatStatus(selectedSeatNumber) !== 'available'}
              onClick={handleBooking}
              className="w-full py-2.5 px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Confirm Seat Reservation</span>
            </button>
          </div>

          {/* Active Reservations summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              My Active Seat Bookings ({activeBookings.length})
            </h4>

            {activeBookings.length === 0 ? (
              <p className="text-xs text-slate-500">No active carrel bookings for today.</p>
            ) : (
              activeBookings.map(b => (
                <div 
                  key={b.id}
                  className="p-3 bg-[#F5F3FF] rounded-xl border border-violet-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#1E293B]">{b.seatNumber}</span>
                    <p className="text-[11px] text-slate-600 font-tabular">{b.date} · {b.timeSlot}</p>
                  </div>
                  <button
                    onClick={() => cancelSeatReservation(b.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    Release
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
