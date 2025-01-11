export interface Talent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string; // Reference to Role ID
  categories: TalentCategory[]; // Array of selected categories and subcategories
  engagementType: string[];
  workingModel: string[];
  salaryRange: number;
  linkedInProfile: string;
  githubProfile: string;
  fileUrl: string;
  fileUrlSigned: string;
  monthlyHourly: string;
  experience: number;
  techStack: string;
  privacyPolicyAgreement: boolean;
  isApproved: boolean;
  profileImage: IProfileImage; // New property for profile image
}


interface IProfileImage {
  blurred: string; // URL for the blurred image
  clean: string; // URL for the blurred image
  blurredSigned: string; // URL for the blurred image
  cleanSigned: string; // URL for the blurred image
}

interface TalentCategory {
  categoryId: string;
  selectedSubcategories: string[];
}