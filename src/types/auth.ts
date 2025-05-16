
import { User as FirebaseUser } from 'firebase/auth';

// Extended user type that includes both Firebase User properties and our custom properties
export interface User extends FirebaseUser {
  uid: string;  // Ensure uid is explicitly defined
  // Add any additional custom user properties here
}
