import type { Timestamp } from 'firebase/firestore'
import type {
  AgeRange,
  BroughtHereReason,
  EnergyDrain,
  FamiliarExperience,
  GenderOption,
  InformationPreference,
  NdStatus,
  PeakEnergyTime,
  Profession,
  SuccessGoal,
  SupportStyle,
  WorkLocation,
} from '@/types/onboarding'
import type { UserWorkProfile } from '@/types/work-energy'

/** Top-level fields on users/{userId} */
export interface UserDocument {
  displayName: string | null
  preferredName: string | null
  email: string | null
  photoURL: string | null
  createdAt: Timestamp | null
  lastLogin: Timestamp | null
  onboardingCompleted: boolean
  reasonForJoining: BroughtHereReason | null
  ndStatus: NdStatus | null
  experiences: FamiliarExperience[]
  workEnvironment: WorkLocation | null
  jobRole: Profession | null
  energyDrainers: EnergyDrain[]
  peakEnergyTime: PeakEnergyTime | null
  supportStyle: SupportStyle | null
  informationPreference: InformationPreference | null
  goals: SuccessGoal[]
  ageRange: AgeRange | null
  gender: GenderOption | null
  country: string | null
  appVersion: string | null
  updatedAt: Timestamp | null
  /** Legacy nested profile — kept for check-ins, strategies, reminders */
  workProfile?: UserWorkProfile
}

export type OnboardingDocumentPatch = Partial<
  Pick<
    UserDocument,
    | 'preferredName'
    | 'reasonForJoining'
    | 'ndStatus'
    | 'experiences'
    | 'workEnvironment'
    | 'jobRole'
    | 'energyDrainers'
    | 'peakEnergyTime'
    | 'supportStyle'
    | 'informationPreference'
    | 'goals'
    | 'ageRange'
    | 'gender'
    | 'country'
    | 'onboardingCompleted'
    | 'appVersion'
  >
>
