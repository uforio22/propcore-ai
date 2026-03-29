// ===== PropCore AI — Tenant Portal Mock Data =====

// Documents per tenant
const TENANT_DOCUMENTS = {
  T001: [
    { id: 'DOC-001', name: 'Tenancy Agreement', type: 'Tenancy', category: 'Tenancy', date: '2025-09-01', fileType: 'PDF', icon: '📋' },
    { id: 'DOC-002', name: 'Move-in Inventory', type: 'Inventory', category: 'Tenancy', date: '2025-09-01', fileType: 'PDF', icon: '📦' },
    { id: 'DOC-003', name: 'Gas Safety Certificate 2025', type: 'Certificate', category: 'Safety', date: '2025-08-20', fileType: 'PDF', icon: '🔥' },
    { id: 'DOC-004', name: 'EPC Rating — Band C', type: 'Certificate', category: 'Safety', date: '2024-03-15', fileType: 'PDF', icon: '⚡' },
    { id: 'DOC-005', name: 'How to Report Maintenance', type: 'Guide', category: 'Correspondence', date: '2025-09-01', fileType: 'PDF', icon: '📖' },
    { id: 'DOC-006', name: 'Welcome Letter', type: 'Letter', category: 'Correspondence', date: '2025-09-01', fileType: 'PDF', icon: '✉️' },
  ],
  T003: [
    { id: 'DOC-010', name: 'Tenancy Agreement — Room 1', type: 'Tenancy', category: 'Tenancy', date: '2025-10-01', fileType: 'PDF', icon: '📋' },
    { id: 'DOC-011', name: 'Room Inventory — Room 1', type: 'Inventory', category: 'Tenancy', date: '2025-10-01', fileType: 'PDF', icon: '📦' },
    { id: 'DOC-012', name: 'House Rules — 8 Victoria Terrace', type: 'Guide', category: 'Tenancy', date: '2025-10-01', fileType: 'PDF', icon: '📖' },
    { id: 'DOC-013', name: 'Gas Safety Certificate 2025', type: 'Certificate', category: 'Safety', date: '2025-07-10', fileType: 'PDF', icon: '🔥' },
    { id: 'DOC-014', name: 'Fire Safety Notice', type: 'Notice', category: 'Safety', date: '2025-10-01', fileType: 'PDF', icon: '🧯' },
    { id: 'DOC-015', name: 'EPC Rating — Band D', type: 'Certificate', category: 'Safety', date: '2023-11-20', fileType: 'PDF', icon: '⚡' },
  ],
  T006: [
    { id: 'DOC-020', name: 'Tenancy Agreement', type: 'Tenancy', category: 'Tenancy', date: '2025-06-15', fileType: 'PDF', icon: '📋' },
    { id: 'DOC-021', name: 'Move-in Inventory', type: 'Inventory', category: 'Tenancy', date: '2025-06-15', fileType: 'PDF', icon: '📦' },
    { id: 'DOC-022', name: 'Gas Safety Certificate 2025', type: 'Certificate', category: 'Safety', date: '2025-05-28', fileType: 'PDF', icon: '🔥' },
    { id: 'DOC-023', name: 'EPC Rating — Band B', type: 'Certificate', category: 'Safety', date: '2024-01-10', fileType: 'PDF', icon: '⚡' },
    { id: 'DOC-024', name: 'Rent Increase Notice — April 2026', type: 'Notice', category: 'Correspondence', date: '2026-02-15', fileType: 'PDF', icon: '📨' },
  ],
  T010: [
    { id: 'DOC-030', name: 'Tenancy Agreement — Room A', type: 'Tenancy', category: 'Tenancy', date: '2025-09-15', fileType: 'PDF', icon: '📋' },
    { id: 'DOC-031', name: 'Room Inventory — Room A', type: 'Inventory', category: 'Tenancy', date: '2025-09-15', fileType: 'PDF', icon: '📦' },
    { id: 'DOC-032', name: 'Gas Safety Certificate 2025', type: 'Certificate', category: 'Safety', date: '2025-08-01', fileType: 'PDF', icon: '🔥' },
    { id: 'DOC-033', name: 'EPC Rating — Band C', type: 'Certificate', category: 'Safety', date: '2024-06-20', fileType: 'PDF', icon: '⚡' },
  ],
};

// Messages per tenant (conversation threads)
const TENANT_MESSAGES = {
  T001: [
    { id: 'MSG-001', from: 'tenant', text: "Hi, I've not had hot water since last night. The boiler display shows an error code E119. Can someone come look at it?", time: '2026-03-21T08:15:00', read: true },
    { id: 'MSG-002', from: 'agent', agent: 'Tenant Support', text: "Thanks for letting us know, Emma. I've logged this as an urgent maintenance job (MJ-2026-001). Dave Plumbing Services has been notified and should be in touch shortly to arrange access.", time: '2026-03-21T08:18:00', read: true },
    { id: 'MSG-003', from: 'agent', agent: 'Contractor Booking', text: "Dave Plumbing Services has confirmed — they'll attend tomorrow (22 Mar) between 9:00–12:00. Please ensure someone is home to provide access.", time: '2026-03-21T09:30:00', read: true },
    { id: 'MSG-004', from: 'tenant', text: "That's great, thank you. I'll be working from home so access is fine.", time: '2026-03-21T09:45:00', read: true },
    { id: 'MSG-005', from: 'agent', agent: 'Maintenance', text: "Just to confirm — Dave from Dave Plumbing Services has arrived at the property and is looking at the boiler now.", time: '2026-03-22T09:20:00', read: true },
    { id: 'MSG-006', from: 'tenant', text: "Yes he's here now. Seems to know what the issue is.", time: '2026-03-22T09:30:00', read: true },
    { id: 'MSG-007', from: 'agent', agent: 'Tenant Support', text: "Hi Emma, I noticed your bathroom sink was also reported as slow draining last month. Just checking — is that still all sorted after the repair?", time: '2026-03-23T10:00:00', read: false },
    { id: 'MSG-008', from: 'agent', agent: 'Rent Chase', text: "Just a heads up — your March rent of £950 is due on 25 Mar. We'll send a confirmation once payment is received.", time: '2026-03-23T14:00:00', read: false },
  ],
  T003: [
    { id: 'MSG-020', from: 'tenant', text: "The lock on my bedroom door is jammed and I can't lock it properly. It's a security concern as I have valuables in my room.", time: '2026-03-20T14:00:00', read: true },
    { id: 'MSG-021', from: 'agent', agent: 'Tenant Support', text: "Hi Liam, I've logged this as an urgent job. Bristol Lock & Key has been assigned and will contact you to arrange a time. Job ref: MJ-2026-002.", time: '2026-03-20T14:10:00', read: true },
    { id: 'MSG-022', from: 'agent', agent: 'Contractor Booking', text: "Bristol Lock & Key will attend on 24 Mar at 10:00. They'll come directly to your room — please let us know if this time doesn't suit.", time: '2026-03-21T09:00:00', read: true },
    { id: 'MSG-023', from: 'tenant', text: "10am Monday works. Thanks for sorting it quickly.", time: '2026-03-21T10:00:00', read: true },
  ],
  T006: [
    { id: 'MSG-040', from: 'tenant', text: "Hi, the dishwasher isn't draining properly. Water is sitting in the bottom after each cycle.", time: '2026-03-10T16:00:00', read: true },
    { id: 'MSG-041', from: 'agent', agent: 'Tenant Support', text: "Thanks Priya, I've logged this as MJ-2026-005 and assigned QuickFix Appliances. They should be out within a few days.", time: '2026-03-10T16:15:00', read: true },
    { id: 'MSG-042', from: 'agent', agent: 'Maintenance', text: "Repair complete! The drain hose was blocked — it's been cleared and tested. Everything draining normally now. You'll receive a short feedback form via email.", time: '2026-03-14T16:00:00', read: true },
    { id: 'MSG-043', from: 'tenant', text: "Thanks for the quick fix! Already submitted my feedback.", time: '2026-03-14T18:30:00', read: true },
    { id: 'MSG-044', from: 'agent', agent: 'Rent Chase', text: "Hi Priya, we noticed your rent increase of £25/month takes effect from April. Your new monthly amount will be £1,475. Please update your standing order.", time: '2026-03-15T10:00:00', read: true },
    { id: 'MSG-045', from: 'tenant', text: "I saw the notice — I've updated my standing order already. Quick question: is the heating system making banging noises normal? Started yesterday.", time: '2026-03-22T18:30:00', read: true },
    { id: 'MSG-046', from: 'agent', agent: 'Tenant Support', text: "Not ideal — could be an airlock or water hammer. I've logged it as MJ-2026-015. We'll get a plumber to check. No emergency risk so it'll be scheduled within a few days.", time: '2026-03-22T18:35:00', read: true },
  ],
  T010: [
    { id: 'MSG-060', from: 'tenant', text: "There's water coming through my ceiling when it rains heavily. It's staining the plaster and dripping onto my desk. Room A.", time: '2026-03-18T10:30:00', read: true },
    { id: 'MSG-061', from: 'agent', agent: 'Tenant Support', text: "That sounds like a roof issue, Jack. I've logged this as urgent — MJ-2026-004. A roofer will be arranged ASAP. In the meantime, please place a bucket or towel to catch drips and move any electronics away.", time: '2026-03-18T10:35:00', read: true },
    { id: 'MSG-062', from: 'agent', agent: 'Contractor Booking', text: "Apex Roofing Bristol will attend on 25 Mar to inspect the roof and guttering. They may need access to your room to check the ceiling from inside.", time: '2026-03-19T11:00:00', read: true },
    { id: 'MSG-063', from: 'tenant', text: "OK that's fine. I'll make sure I'm here. It's getting worse with the heavy rain this week.", time: '2026-03-19T12:00:00', read: true },
  ],
};

// Appointments per tenant
const TENANT_APPOINTMENTS = {
  T001: [
    { id: 'APT-001', type: 'Contractor Visit', title: 'Boiler Repair — Dave Plumbing Services', date: '2026-03-22', time: '09:00 – 12:00', who: 'Dave Harrison', status: 'In Progress', notes: 'Error code E119 — boiler not producing hot water' },
    { id: 'APT-002', type: 'Inspection', title: 'Routine Property Inspection', date: '2026-04-10', time: '14:00 – 15:00', who: 'Sarah Mitchell (Property Manager)', status: 'Upcoming', notes: 'Annual inspection — please ensure access to all rooms' },
  ],
  T003: [
    { id: 'APT-010', type: 'Contractor Visit', title: 'Lock Repair — Bristol Lock & Key', date: '2026-03-24', time: '10:00 – 11:00', who: 'Steve Lockwood', status: 'Upcoming', notes: 'Bedroom door lock jammed, Room 1' },
  ],
  T006: [
    { id: 'APT-020', type: 'Contractor Visit', title: 'Heating Check — Plumber', date: '2026-03-28', time: 'TBC', who: 'To be confirmed', status: 'Pending', notes: 'Banging noises from pipes — needs diagnosis' },
  ],
  T010: [
    { id: 'APT-030', type: 'Contractor Visit', title: 'Roof Inspection — Apex Roofing Bristol', date: '2026-03-25', time: '10:00 – 13:00', who: 'Phil Torres', status: 'Upcoming', notes: 'Water ingress Room A — inspect guttering and flashing' },
    { id: 'APT-031', type: 'Inspection', title: 'HMO Fire Safety Check', date: '2026-04-05', time: '11:00 – 12:00', who: 'Sarah Mitchell (Property Manager)', status: 'Upcoming', notes: 'Annual fire safety check — all communal areas' },
  ],
};

// Tenant profile lookup — maps tenant IDs used in the switcher to their data
const TENANT_PROFILES = {
  T001: { name: 'Emma Richardson', email: 'emma.r@email.com', phone: '07712 345678', property: '14 Manor Road, Flat 1', propertyId: 'P001', room: null, leaseStart: '2025-09-01', leaseEnd: '2026-08-31', rent: 950, tenantIndex: 0 },
  T003: { name: 'Liam Carter', email: 'liam.carter@email.com', phone: '07834 567890', property: '8 Victoria Terrace', propertyId: 'P005', room: 'Room 1', leaseStart: '2025-10-01', leaseEnd: '2026-09-30', rent: 625, tenantIndex: 2 },
  T006: { name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '07900 234567', property: '22 Elmwood Crescent', propertyId: 'P004', room: null, leaseStart: '2025-06-15', leaseEnd: '2026-06-14', rent: 1450, tenantIndex: 5 },
  T010: { name: 'Jack Morrison', email: 'jack.m@email.com', phone: '07823 456789', property: '35 Park Street', propertyId: 'P006', room: 'Room A', leaseStart: '2025-09-15', leaseEnd: '2026-09-14', rent: 575, tenantIndex: 9 },
};
