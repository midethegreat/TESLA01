export interface InvestmentPlan {
  id: string
  name: string
  returnLabel: string
  minInvestment: number
  maxInvestment: number
  capitalBack: boolean
  returnType: string
  periods: number
  withdrawType: string
  isHot?: boolean
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ProcessStep {
  title: string
  description: string
  icon: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  country: string
  emailVerified: boolean
  createdAt?: string
  username?: string
  gender?: string
  dateOfBirth?: string
  phone?: string
  city?: string
  zipCode?: string
  address?: string
  joiningDate?: string
  profilePicture?: string
  kycVerified?: boolean
  kycStatus?: "none" | "submitted" | "verified" | "rejected"
  referrerId?: string
  referralCount?: number
  role?: "user" | "admin" | "superadmin"
  kycData?: {
    fullName: string
    dob: string
    idType: string
    idFrontPath?: string
    idBackPath?: string
    selfiePath?: string
    submittedAt?: string
    verifiedAt?: string
    verifiedBy?: string
  }
}

export interface Document {
  id: string
  userId: string
  fileName: string
  fileType: string
  filePath: string
  fileSize: number
  uploadedAt: string
}

export interface ProfileImage {
  id: string
  userId: string
  imagePath: string
  uploadedAt: string
}

export interface AuthToken {
  token: string
  user: User
}

export interface Update {
  id: string
  userId: string
  type: string
  data: string
  read: boolean
  createdAt: string
}

export interface AdminUser {
  id: string
  email: string
  password: string
  role: "admin" | "superadmin"
  createdAt: string
}

export interface KYCRequest {
  userId: string
  fullName: string
  dob: string
  idType: string
  idFrontPath: string
  idBackPath: string
  selfiePath: string
  submittedAt: string
  status: "pending" | "verified" | "rejected"
  reviewedBy?: string
  reviewedAt?: string
}
