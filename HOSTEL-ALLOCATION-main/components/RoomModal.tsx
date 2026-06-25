import React, { useState } from 'react';
import { Room, User, Bed, UserRole, RoomStatus } from '../types';
import { FEATURES } from '../constants';
import { X, Wifi, ShieldAlert, BadgeInfo, Check, Sparkles, AlertCircle, Wrench, IndianRupee } from 'lucide-react';

interface RoomModalProps {
  room: Room;
  user: User;
  allUsers: User[];
  onClose: () => void;
  onAction: (room: Room, action: string, bedId?: string) => void;
  onFeatureUpdate: (roomId: string, newFeatures: string[]) => void;
  onRoomUpdate: (updatedRoom: Room) => void;
  hasPendingRequest: boolean;
  availableFeatures?: string[];
}

export function RoomModal({
  room,
  user,
  allUsers,
  onClose,
  onAction,
  onFeatureUpdate,
  onRoomUpdate,
  hasPendingRequest,
  availableFeatures = FEATURES
}: RoomModalProps) {
  const isAdmin = user.role === UserRole.ADMIN;
  const isStudent = user.role === UserRole.STUDENT;

  const [localFeatures, setLocalFeatures] = useState<string[]>(room.features || []);
  const [isEditingFeatures, setIsEditingFeatures] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [localPrice, setLocalPrice] = useState<number>(room.price || 0);

  // Helper function to find user details by occupant ID
  const getOccupantDetails = (occupantId?: string | null) => {
    if (!occupantId) return null;
    return allUsers.find(u => u.id === occupantId) || { id: occupantId, name: 'Allocated occupant', email: '', role: UserRole.STUDENT, gender: user.gender };
  };

  const handleToggleFeature = (feature: string) => {
    let nextFeatures;
    if (localFeatures.includes(feature)) {
      nextFeatures = localFeatures.filter(f => f !== feature);
    } else {
      nextFeatures = [...localFeatures, feature];
    }
    setLocalFeatures(nextFeatures);
  };

  const handleSaveFeatures = () => {
    onFeatureUpdate(room.id, localFeatures);
    setIsEditingFeatures(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200" id={`room-modal-${room.id}`}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col relative max-h-[90vh]">
        
        {/* Header decoration bar */}
        <div className={`h-2 w-full ${room.status === RoomStatus.MAINTENANCE ? 'bg-amber-500' : 'bg-indigo-600'}`} />

        {/* Action Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-800 font-mono">Room Block {room.number}</h2>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                room.status === RoomStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 
                room.status === RoomStatus.MAINTENANCE ? 'bg-amber-50 text-amber-800 border border-amber-200' : 
                'bg-indigo-50 text-indigo-800 border border-indigo-200'
              }`}>
                {room.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Floor {room.floor} · {room.type} · Capacity {room.capacity} beds
            </p>
          </div>
          <button 
            onClick={onClose}
            id="btn-room-modal-close"
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-450 hover:text-slate-800 rounded-xl transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bed Allocation grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500" /> Bed Allocations & Request Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {room.beds.map((bed) => {
                const occupant = getOccupantDetails(bed.occupantId);
                const isBedAvailable = bed.status === 'Available';
                const isBedOccupied = bed.status === 'Occupied';
                const isBedRequested = bed.status === 'Requested';
                const isBedMaintenance = bed.status === 'Maintenance';

                return (
                  <div 
                    key={bed.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between h-40 transition-all ${
                      isBedOccupied ? 'bg-indigo-50/20 border-indigo-200' : 
                      isBedRequested ? 'bg-orange-50/30 border-orange-200 animate-pulse' :
                      isBedMaintenance ? 'bg-amber-50/20 border-amber-200' :
                      'bg-slate-50/30 border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Bed Node</span>
                        <h4 className="text-base font-black text-slate-800">Bed Single {bed.number}</h4>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isBedOccupied ? 'bg-indigo-100 text-indigo-805' : 
                        isBedRequested ? 'bg-orange-100 text-orange-800' :
                        isBedMaintenance ? 'bg-amber-100 text-amber-805' : 
                        'bg-emerald-100 text-emerald-805'
                      }`}>
                        {bed.status}
                      </span>
                    </div>

                    {/* Occupant card if occupied */}
                    {isBedOccupied && occupant && (
                      <div className="flex items-center gap-2 mt-2 bg-white border border-slate-100 p-2 rounded-xl">
                        <img 
                          src={occupant.avatarUrl || `https://ui-avatars.com/api/?name=${occupant.name}&background=random`} 
                          alt={occupant.name} 
                          className="w-7 h-7 rounded-full border border-slate-205"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-slate-800 truncate leading-none">{occupant.name}</p>
                          <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{occupant.id}</span>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => onAction(room, 'vacate', bed.id)}
                            id={`btn-vacate-${bed.id}`}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-2 py-1 rounded text-[10px] font-black transition-colors"
                          >
                            Vacate
                          </button>
                        )}
                      </div>
                    )}

                    {/* Requested status info */}
                    {isBedRequested && occupant && (
                      <div className="text-xs text-orange-750 bg-orange-50/50 p-2 rounded-xl border border-orange-100">
                        Requested by <span className="font-bold">{occupant.name}</span>. Pending Warden approval.
                      </div>
                    )}

                    {/* Actions if vacant/available */}
                    {isBedAvailable && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                          <Check size={14} /> Available Now
                        </span>
                        {isStudent && !user.assignedRoomId && !hasPendingRequest && (
                          <button
                            onClick={() => onAction(room, 'request', bed.id)}
                            id={`btn-request-bed-${bed.id}`}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 font-black text-xs shadow-md shadow-indigo-600/15 active:scale-95 transition-all text-center shrink-0 border border-indigo-600"
                          >
                            Book Bed
                          </button>
                        )}
                      </div>
                    )}

                    {/* Maintenance mode */}
                    {isBedMaintenance && (
                      <div className="text-xs text-amber-750 bg-amber-50/50 p-2 rounded-xl border border-amber-100 flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-amber-500 shrink-0" /> Under Repair or checks
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Features */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Room Amenities</h3>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (isEditingFeatures) {
                        handleSaveFeatures();
                      } else {
                        setIsEditingFeatures(true);
                      }
                    }}
                    id="btn-edit-features"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    {isEditingFeatures ? 'Save Features' : 'Edit Amenities'}
                  </button>
                )}
              </div>

              {isEditingFeatures ? (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap gap-2" id="features-editor">
                  {availableFeatures.map(f => {
                    const isChecked = localFeatures.includes(f);
                    return (
                      <button
                        key={f}
                        onClick={() => handleToggleFeature(f)}
                        id={`btn-toggle-feature-${f}`}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all ${
                          isChecked 
                            ? 'bg-indigo-650 border-indigo-600 text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5" id="features-display animate-in zoom-in-5">
                  {room.features && room.features.length > 0 ? (
                    room.features.map(f => (
                      <div 
                        key={f}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Wifi size={13} className="text-indigo-500" />
                        <span>{f}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs italic">No specific features configured.</span>
                  )}
                </div>
              )}
            </div>

            {/* Room Fee Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Fee Billing Structure</h3>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (isEditingPrice) {
                        const updatedRoom = { ...room, price: Number(localPrice) || 0 };
                        onRoomUpdate(updatedRoom);
                        setIsEditingPrice(false);
                      } else {
                        setLocalPrice(room.price || 0);
                        setIsEditingPrice(true);
                      }
                    }}
                    id="btn-edit-price"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    {isEditingPrice ? 'Save Fee' : 'Edit Fee'}
                  </button>
                )}
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-inner">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <IndianRupee size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  {isEditingPrice ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        value={localPrice}
                        onChange={(e) => setLocalPrice(Number(e.target.value) || 0)}
                        id="input-room-fees"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-left"
                        placeholder="Enter room fee"
                        min="0"
                      />
                    </div>
                  ) : (
                    <h4 className="text-base font-black text-slate-800">₹{(room.price).toLocaleString('en-IN')}</h4>
                  )}
                  <span className="text-[10px] text-slate-400 block uppercase font-bold mt-0.5">Per Student / Year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warden Services Section (Admin only) */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Warden Control Services</h3>
              <div className="flex flex-wrap gap-2">
                {room.status === RoomStatus.MAINTENANCE ? (
                  <button
                    onClick={() => onAction(room, 'maintenance_complete')}
                    id="btn-room-modal-maintenance-complete"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 active:scale-95 transition-all text-center border border-emerald-600"
                  >
                    <Check size={14} /> Mark Maintenance Completed
                  </button>
                ) : (
                  <button
                    onClick={() => onAction(room, 'maintenance')}
                    id="btn-room-modal-maintenance"
                    className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-3 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 active:scale-95 transition-all text-center border border-amber-600"
                  >
                    <Wrench size={14} /> Tag Room for Service (Maintenance Mode)
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer info box */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400 shrink-0">
          <BadgeInfo size={12} /> ALL ROOMMATE COMPATIBILITY GENDER PRE-FILTERS APPLIED
        </div>

      </div>
    </div>
  );
}
