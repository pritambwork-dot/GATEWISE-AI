import { NextResponse } from 'next/server';

// Grounded Centralized Database Records for IIM Sambalpur
interface RegisteredPersonDb {
  id: string;
  person_code: string;
  full_name: string;
  category: 'Faculty' | 'Student' | 'Staff' | 'Contractor' | 'Visitor' | 'VIP';
  department: string;
  designation?: string;
  photo_url: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  associated_vehicle_plates: string[]; // normalized plates
}

const AUTHORIZED_PERSONS_DB: RegisteredPersonDb[] = [
  {
    id: 'per-001',
    person_code: 'FAC-8041',
    full_name: 'Dr. Rahul Sharma',
    category: 'Faculty',
    department: 'Operations & Strategy, IIM Sambalpur',
    designation: 'Associate Professor',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    associated_vehicle_plates: ['OD15AB1234'],
  },
  {
    id: 'per-002',
    person_code: 'FAC-8042',
    full_name: 'Dr. Ananya Sharma',
    category: 'Faculty',
    department: 'Dean Academics, IIM Sambalpur',
    designation: 'Professor & Dean',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    associated_vehicle_plates: ['OD15K5521'],
  },
  {
    id: 'per-003',
    person_code: 'STU-2024-089',
    full_name: 'Rahul Verma',
    category: 'Student',
    department: 'MBA 2024-26, IIM Sambalpur',
    designation: 'MBA Scholar',
    photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    associated_vehicle_plates: ['OD15M4012'],
  },
  {
    id: 'per-004',
    person_code: 'STU-2024-112',
    full_name: 'Vikram Patel',
    category: 'Student',
    department: 'MBA 2024-26, IIM Sambalpur',
    designation: 'MBA Scholar',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    status: 'EXPIRED', // Expired permission scenario
    associated_vehicle_plates: ['OD15Q8890'],
  },
  {
    id: 'per-005',
    person_code: 'VIS-2024-031',
    full_name: 'Raghavan Iyer',
    category: 'Visitor',
    department: 'Executive MDP Guest, IIM Sambalpur',
    designation: 'Advisory Speaker',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    associated_vehicle_plates: ['OD15Z9001'],
  },
];

interface RegisteredVehicleDb {
  license_plate: string;
  normalized_plate: string;
  vehicle_type: 'Car' | 'Two-Wheeler' | 'Bus' | 'Commercial' | 'Emergency';
  make_model: string;
  color: string;
  owner_id: string;
  owner_name: string;
  is_authorized: boolean;
}

const AUTHORIZED_VEHICLES_DB: RegisteredVehicleDb[] = [
  {
    license_plate: 'OD-15-AB-1234',
    normalized_plate: 'OD15AB1234',
    vehicle_type: 'Car',
    make_model: 'Tata Safari XZA+',
    color: 'Orcus White',
    owner_id: 'per-001',
    owner_name: 'Dr. Rahul Sharma',
    is_authorized: true,
  },
  {
    license_plate: 'OD-15-K-5521',
    normalized_plate: 'OD15K5521',
    vehicle_type: 'Car',
    make_model: 'Honda City ZX',
    color: 'Lunar Silver',
    owner_id: 'per-002',
    owner_name: 'Dr. Ananya Sharma',
    is_authorized: true,
  },
  {
    license_plate: 'OD-15-M-4012',
    normalized_plate: 'OD15M4012',
    vehicle_type: 'Two-Wheeler',
    make_model: 'Yamaha FZ-S V4',
    color: 'Racing Blue',
    owner_id: 'per-003',
    owner_name: 'Rahul Verma',
    is_authorized: true,
  },
  {
    license_plate: 'OD-15-Q-8890',
    normalized_plate: 'OD15Q8890',
    vehicle_type: 'Car',
    make_model: 'Hyundai Creta SX',
    color: 'Titan Grey',
    owner_id: 'per-004',
    owner_name: 'Vikram Patel',
    is_authorized: false, // Suspended / Expired
  },
  {
    license_plate: 'OD-15-Z-9001',
    normalized_plate: 'OD15Z9001',
    vehicle_type: 'Car',
    make_model: 'Toyota Innova Crysta',
    color: 'Silver',
    owner_id: 'per-005',
    owner_name: 'Raghavan Iyer',
    is_authorized: true,
  },
];

function normalizePlate(plate: string): string {
  return plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      face_identifier, // Name, code, or biometric query
      vehicle_plate,   // License plate extracted by ANPR
      guard_id = 'GRD-101',
      gate_id = 'gate-01',
    } = body;

    // 1. Biometric Matching: Find Person
    let matchedPerson: RegisteredPersonDb | undefined;
    let confidenceScore = 0.0;

    if (face_identifier) {
      const q = face_identifier.trim().toLowerCase();
      matchedPerson = AUTHORIZED_PERSONS_DB.find(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          p.person_code.toLowerCase() === q ||
          p.id.toLowerCase() === q
      );
      if (matchedPerson) {
        // High confidence match score
        confidenceScore = 0.982;
      }
    }

    // 2. ANPR OCR Matching: Find Vehicle
    let matchedVehicle: RegisteredVehicleDb | undefined;
    let normalizedInputPlate = '';

    if (vehicle_plate && vehicle_plate.trim()) {
      normalizedInputPlate = normalizePlate(vehicle_plate);
      matchedVehicle = AUTHORIZED_VEHICLES_DB.find(
        (v) => v.normalized_plate === normalizedInputPlate
      );
    }

    // 3. Determine Case 1, Case 2, or Case 3
    const timestamp = new Date().toISOString();

    // Check Expired Access Permission
    if (matchedPerson && matchedPerson.status === 'EXPIRED') {
      return NextResponse.json({
        success: true,
        case_outcome: 'ACCESS_DENIED',
        status_title: 'NOT VERIFIED',
        access_decision: 'ACCESS_DENIED',
        failure_reason: 'Institutional access permission has expired for this identity.',
        person: {
          id: matchedPerson.person_code,
          name: matchedPerson.full_name,
          category: matchedPerson.category,
          department: matchedPerson.department,
          photo_url: matchedPerson.photo_url,
          face_matched: true,
          confidence_score: 0.965,
        },
        vehicle: matchedVehicle
          ? {
              license_plate: matchedVehicle.license_plate,
              normalized_plate: matchedVehicle.normalized_plate,
              vehicle_matched: true,
              is_associated_with_person: true,
              vehicle_type: matchedVehicle.vehicle_type,
            }
          : undefined,
        timestamp,
      });
    }

    // CASE 1: PERSON AND VEHICLE VERIFIED
    // - Person exists and authorized
    // - Vehicle exists, authorized, and is registered against this person's account
    if (
      matchedPerson &&
      matchedVehicle &&
      matchedVehicle.is_authorized &&
      matchedPerson.associated_vehicle_plates.includes(matchedVehicle.normalized_plate)
    ) {
      return NextResponse.json({
        success: true,
        case_outcome: 'CASE_1_VERIFIED',
        status_title: 'VERIFIED',
        access_decision: 'AUTHORIZED',
        person: {
          id: matchedPerson.person_code,
          name: matchedPerson.full_name,
          category: matchedPerson.category,
          department: matchedPerson.department,
          photo_url: matchedPerson.photo_url,
          face_matched: true,
          confidence_score: confidenceScore,
        },
        vehicle: {
          license_plate: matchedVehicle.license_plate,
          normalized_plate: matchedVehicle.normalized_plate,
          vehicle_matched: true,
          is_associated_with_person: true,
          vehicle_type: matchedVehicle.vehicle_type,
        },
        timestamp,
      });
    }

    // CASE 2: PERSON FOUND, VEHICLE NOT REGISTERED
    // - Person exists and authorized
    // - But vehicle is either not in database, or not registered against this person's account
    if (matchedPerson && (!matchedVehicle || !matchedPerson.associated_vehicle_plates.includes(normalizedInputPlate))) {
      return NextResponse.json({
        success: true,
        case_outcome: 'CASE_2_PARTIALLY_VERIFIED',
        status_title: 'PARTIALLY VERIFIED',
        access_decision: 'PARTIALLY_AUTHORIZED',
        failure_reason: vehicle_plate
          ? `Vehicle ${vehicle_plate} is not registered or not associated with ${matchedPerson.full_name}'s institutional account.`
          : 'No registered campus vehicle was scanned with this subject.',
        person: {
          id: matchedPerson.person_code,
          name: matchedPerson.full_name,
          category: matchedPerson.category,
          department: matchedPerson.department,
          photo_url: matchedPerson.photo_url,
          face_matched: true,
          confidence_score: confidenceScore,
        },
        vehicle: matchedVehicle
          ? {
              license_plate: matchedVehicle.license_plate,
              normalized_plate: matchedVehicle.normalized_plate,
              vehicle_matched: true,
              is_associated_with_person: false, // mismatch
              vehicle_type: matchedVehicle.vehicle_type,
            }
          : vehicle_plate
          ? {
              license_plate: vehicle_plate,
              normalized_plate: normalizedInputPlate,
              vehicle_matched: false,
              is_associated_with_person: false,
            }
          : undefined,
        timestamp,
      });
    }

    // CASE 3: PERSON OR VEHICLE NOT FOUND
    // - Person not found in master database
    return NextResponse.json({
      success: true,
      case_outcome: 'CASE_3_NOT_VERIFIED',
      status_title: 'NOT VERIFIED',
      access_decision: 'NOT_AUTHORIZED',
      failure_reason: 'No matching authorized record was found in the centralized database.',
      person: {
        id: 'UNKNOWN',
        name: face_identifier || 'Unrecognized Visitor',
        category: 'Unregistered',
        face_matched: false,
        confidence_score: 0.28,
      },
      vehicle: vehicle_plate
        ? {
            license_plate: vehicle_plate,
            normalized_plate: normalizedInputPlate,
            vehicle_matched: !!matchedVehicle,
            is_associated_with_person: false,
            vehicle_type: matchedVehicle?.vehicle_type,
          }
        : undefined,
      timestamp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, detail: error.message || 'Verification engine failed' },
      { status: 500 }
    );
  }
}
