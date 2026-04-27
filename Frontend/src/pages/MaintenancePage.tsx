import { useState } from 'react';
import {
  Plus, MoreHorizontal, MapPin, User, CheckCircle2,
  ClipboardList, Clock, ChevronRight,
} from 'lucide-react';
import { canTransition, nextStatus } from '../lib/maintenanceStateMachine';
import type { MaintenanceTicket, TicketPriority, TicketStatus } from '../types';

const COLS: { status: TicketStatus; label: string; accent: string; dot: string }[] = [
  { status: 'REPORTED',    label: 'New Requests', accent: 'border-t-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  { status: 'IN_PROGRESS', label: 'In Progress',  accent: 'border-t-[#2563EB]', dot: 'bg-[#2563EB]' },
  { status: 'RESOLVED',    label: 'Resolved',     accent: 'border-t-[#10B981]', dot: 'bg-[#10B981]' },
];

const PRIORITY_STYLE: Record<string, string> = {
  URGENT:   'bg-[#FEF2F2] text-[#DC2626]',
  STANDARD: 'bg-[#EFF6FF] text-[#2563EB]',
  LOW:      'bg-[#F8FAFC] text-[#64748B]',
};

const LOG_BADGE: Record<string, string> = {
  REPORTED:    'bg-[#FEF9C3] text-[#A16207]',
  IN_PROGRESS: 'bg-[#DBEAFE] text-[#1D4ED8]',
  RESOLVED:    'bg-[#DCFCE7] text-[#15803D]',
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch, apiPost } from '../lib/api';

function ReportIssueModal({ onClose, roomId }: { onClose: () => void; roomId?: string }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('STANDARD');

  const create = useMutation({
    mutationFn: (d: any) => apiPost('/maintenance', d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-[20px] p-6 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Report New Issue</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Issue Title</label>
            <input className="input-field w-full" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. Broken AC" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Description</label>
            <textarea className="input-field w-full" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Describe the issue..." />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Location</label>
            <input className="input-field w-full" value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="e.g. Unit 101" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Priority</label>
            <select className="input-field w-full" value={priority} onChange={(e)=>setPriority(e.target.value as TicketPriority)}>
              <option value="LOW">Low</option>
              <option value="STANDARD">Standard</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <button className="btn-secondary px-4 py-2" onClick={onClose}>Cancel</button>
            <button className="btn-primary px-4 py-2" onClick={() => create.mutate({ title, description, location, priority, roomId })} disabled={create.isPending || !roomId}>
              {create.isPending ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const { data: roomsData } = useQuery({
    queryKey: ['rooms-for-maintenance'],
    queryFn: () => apiGet<any[]>('/rooms'),
  });

  const { data } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => apiGet<{ tickets: MaintenanceTicket[] }>('/maintenance')
  });
  
  const tickets = data?.tickets || [];

  const updateStatus = useMutation({
    mutationFn: ({ id }: { id: string; status: TicketStatus }) =>
      apiPatch(`/maintenance/${id}/advance`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance'] })
  });

  const advance = (t: MaintenanceTicket) => {
    const next = nextStatus(t.status);
    if (!next || !canTransition(t.status, next)) return;
    updateStatus.mutate({ id: t.id, status: next });
  };
  const by = (s: TicketStatus) => tickets.filter((t) => t.status === s);

  const stats = [
    { label: 'Open Tickets',   value: by('REPORTED').length,    sub: '↑ 2 since yesterday', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]' },
    { label: 'In Progress',    value: by('IN_PROGRESS').length,  sub: '4 urgent priority',   color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]' },
    { label: 'Resolved (24h)', value: by('RESOLVED').length,     sub: '98% completion rate', color: 'text-[#059669]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]' },
  ];

  return (
    <div className="flex flex-col gap-7 max-w-[1600px] mx-auto animate-fade-in">
      {showModal && <ReportIssueModal onClose={() => setShowModal(false)} roomId={roomsData?.[0]?.id} />}
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div>
          <p className="flex items-center gap-1.5 text-[#94A3B8] text-[11px] font-medium mb-2">
            Admin <ChevronRight className="w-3 h-3" /> Facility Management
          </p>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-[-0.025em]">
            Maintenance <span className="text-[#2563EB]">Ledger</span>
          </h1>
          <p className="text-[#64748B] text-sm mt-1.5">Oversee and manage facility health across all university clusters.</p>
        </div>
        <button className="btn-primary px-5 py-3 text-sm self-start group" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Report New Issue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200">
            <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-wider">{s.label}</p>
            <div className="flex items-end justify-between mt-3">
              <p className="text-[#0F172A] text-4xl font-bold tracking-[-0.03em] leading-none">{String(s.value).padStart(2, '0')}</p>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${s.bg} ${s.color} border ${s.border}`}>LIVE</span>
            </div>
            <p className="text-[#94A3B8] text-[10px] font-medium mt-3">{s.sub}</p>
          </div>
        ))}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 flex flex-col items-center justify-center gap-3 hover:border-[#BFDBFE] hover:bg-[#F8FAFC] transition-all duration-200 cursor-pointer group">
          <div className="w-10 h-10 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[11px] flex items-center justify-center group-hover:scale-105 transition-transform">
            <ClipboardList className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div className="text-center">
            <p className="text-[#0F172A] text-sm font-semibold">Monthly Audit</p>
            <p className="text-[#94A3B8] text-[10px] font-medium mt-0.5">Generate Report</p>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COLS.map(({ status, label, accent, dot }) => {
          const col = by(status);
          return (
            <div key={status} className={`bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden border-t-4 ${accent}`}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-[#0F172A] font-semibold text-sm">{label}</span>
                  <span className="bg-[#F8FAFC] text-[#94A3B8] text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-[#E2E8F0]">{col.length}</span>
                </div>
                <button className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-[#F8FAFC] text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3 min-h-[360px] custom-scrollbar">
                {col.map((ticket) => {
                  const next = nextStatus(ticket.status);
                  const priorityKey = ticket.status === 'RESOLVED' ? 'LOW' : ticket.priority;
                  return (
                    <div key={ticket.id} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(37,99,235,0.08)] transition-all duration-200 group/card">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide ${PRIORITY_STYLE[priorityKey]}`}>
                          {priorityKey}
                        </span>
                        <span className="text-[#94A3B8] text-[10px] font-medium">#{ticket.ticketNumber}</span>
                      </div>

                      <h4 className={`font-semibold text-sm mb-1.5 leading-snug ${
                        ticket.status === 'RESOLVED' ? 'text-[#94A3B8] line-through' : 'text-[#0F172A] group-hover/card:text-[#2563EB] transition-colors'
                      }`}>
                        {ticket.title}
                      </h4>
                      <p className="text-[#64748B] text-xs leading-relaxed mb-4">{ticket.description}</p>

                      {ticket.assignee && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] mb-3">
                          <div className="w-7 h-7 bg-[#2563EB] rounded-[8px] flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#0F172A] text-[11px] font-semibold truncate">{ticket.assignee}</p>
                            <p className="text-[#94A3B8] text-[9px] font-medium uppercase tracking-wide">Assigned Tech</p>
                          </div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                        </div>
                      )}

                      {ticket.status === 'RESOLVED' && (
                        <div className="flex items-center gap-2 text-[#059669] text-[10px] font-semibold bg-[#ECFDF5] p-2.5 rounded-[10px] border border-[#A7F3D0] mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Staff
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[#94A3B8] text-[10px] font-medium pt-3 border-t border-[#F1F5F9]">
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#2563EB]" />{ticket.location}</div>
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.createdAt).toLocaleDateString()}</div>
                      </div>

                      {next && canTransition(ticket.status, next) && (
                        <button
                          onClick={() => advance(ticket)}
                          className="mt-3.5 w-full text-[11px] bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white font-semibold py-2.5 rounded-[10px] border border-[#BFDBFE] hover:border-[#2563EB] transition-all group/btn"
                        >
                          Move to {next.replace('_', ' ')}
                          <ChevronRight className="w-3 h-3 inline ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {col.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-[#CBD5E1] py-16">
                    <CheckCircle2 className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-xs font-semibold uppercase tracking-wider">All Clear</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Log */}
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden hover:border-[#CBD5E1] transition-all duration-200">
        <div className="flex items-center justify-between p-7 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-[#64748B]" />
            </div>
            <div>
              <h3 className="text-[#0F172A] font-bold text-base tracking-[-0.01em]">Global Activity Log</h3>
              <p className="text-[#94A3B8] text-xs mt-0.5">Historical audit trail</p>
            </div>
          </div>
          <button className="btn-secondary px-4 py-2 text-sm">Export CSV</button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider border-b border-[#F1F5F9]">
                <th className="text-left py-3.5 px-7">Student / Location</th>
                <th className="text-left py-3.5 px-4">Description</th>
                <th className="text-left py-3.5 px-4">Status</th>
                <th className="text-left py-3.5 px-4">Time</th>
                <th className="text-right py-3.5 px-7" />
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Jordan Smith',    loc: 'Unit 502, Building C',  desc: 'Loose door handle in main entrance.',          status: 'REPORTED',    time: '12 mins ago' },
                { name: 'Elena Rodriguez', loc: 'Common Area, Floor 2',  desc: 'Microwave in communal kitchen not heating.',    status: 'IN_PROGRESS', time: '45 mins ago' },
                { name: 'Marcus Chen',     loc: 'Unit 112, Building A',  desc: 'Window latch repaired and sealed.',             status: 'RESOLVED',    time: '3 hours ago' },
              ].map((row) => (
                <tr key={row.name} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors group">
                  <td className="py-4 px-7">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#2563EB] rounded-[10px] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {row.name[0]}
                      </div>
                      <div>
                        <p className="text-[#0F172A] text-sm font-semibold">{row.name}</p>
                        <p className="text-[#94A3B8] text-[10px] font-medium mt-0.5">{row.loc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#64748B] text-sm">{row.desc}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${LOG_BADGE[row.status]}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#94A3B8] text-xs font-medium whitespace-nowrap">{row.time}</td>
                  <td className="py-4 px-7 text-right">
                    <button className="w-8 h-8 flex items-center justify-center rounded-[9px] hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-all ml-auto">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
