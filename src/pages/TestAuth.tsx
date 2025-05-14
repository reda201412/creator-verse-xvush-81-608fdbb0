import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, limit, query, doc, getDoc, setDoc } from 'firebase/firestore';

const TestAuth = () => {
  const { user, profile, isLoading, signOut: contextSignOut } = useAuth();
  const [testOutput, setTestOutput] = useState<string>('');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [username, setUsername] = useState('testuser');

  // Fonction pour tester une lecture Firestore basique
  const testFirestore = async () => {
    setTestOutput('Testing Firestore...');
    try {
      // Tenter de lister les collections
      const collections = ['user_profiles', 'usernames', 'videos', 'messages', 'conversations'];
      let results = 'Collections test:\n';

      for (const collectionName of collections) {
        try {
          const q = query(collection(db, collectionName), limit(1));
          const snapshot = await getDocs(q);
          results += `- ${collectionName}: ${snapshot.empty ? 'Empty' : 'Has data'}\n`;
        } catch (error) {
          results += `- ${collectionName}: ERROR - ${(error as Error).message}\n`;
        }
      }

      setTestOutput(results);
    } catch (error) {
      setTestOutput(`Firestore test failed: ${(error as Error).message}`);
    }
  };

  // Fonction pour s'inscrire directement via Firebase SDK
  const testDirectSignUp = async () => {
    setTestOutput('Testing direct signup...');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setTestOutput(`User created: ${userCredential.user.uid}`);
    } catch (error) {
      setTestOutput(`Direct signup failed: ${(error as Error).message}`);
    }
  };

  // Fonction pour tester la connectivité réseau
  const testNetworkConnection = async () => {
    setTestOutput('Testing network connectivity...');
    try {
      // Test Firebase Auth endpoint
      const authEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
      const authResponse = await fetch(authEndpoint, { 
        method: 'HEAD',
        mode: 'no-cors' // This makes the request work without CORS issues
      });
      
      // Test Firestore endpoint
      const firestoreEndpoint = 'https://firestore.googleapis.com/';
      const firestoreResponse = await fetch(firestoreEndpoint, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      setTestOutput(`Network test results:
- Auth endpoint reached: ${authResponse ? 'Yes' : 'No'}
- Firestore endpoint reached: ${firestoreResponse ? 'Yes' : 'No'}
      
If you see any failures above, it could indicate network connectivity issues.
Common causes:
- Corporate/School firewall blocking Firebase
- Network connectivity issues
- VPN interference
- Proxy settings`);
    } catch (error) {
      setTestOutput(`Network test failed: ${(error as Error).message}`);
    }
  };

  // Test the complete signup process with detailed error reporting
  const testFullSignup = async () => {
    setTestOutput('Starting complete signup process with detailed logging...\n');
    
    try {
      // Step 1: Create Firebase Auth user
      setTestOutput(prev => prev + 'Step 1: Creating Firebase Auth user...\n');
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setTestOutput(prev => prev + `✓ User auth created: ${userCredential.user.uid}\n`);
      } catch (error: any) {
        setTestOutput(prev => prev + `✗ Auth creation failed: ${error.message}\n`);
        setTestOutput(prev => prev + `Error code: ${error.code}\n`);
        setTestOutput(prev => prev + `Full error: ${JSON.stringify(error)}\n`);
        return;
      }
      
      const newUser = userCredential.user;
      
      // Step 2: Update profile with displayName
      setTestOutput(prev => prev + 'Step 2: Updating Firebase Auth profile...\n');
      try {
        await updateProfile(newUser, { displayName: username });
        setTestOutput(prev => prev + '✓ Auth profile updated\n');
      } catch (error: any) {
        setTestOutput(prev => prev + `✗ Auth profile update failed: ${error.message}\n`);
      }
      
      // Step 3: Check username availability
      setTestOutput(prev => prev + 'Step 3: Checking username availability...\n');
      try {
        const usernameRef = doc(db, 'usernames', username);
        const usernameDoc = await getDoc(usernameRef);
        
        if (usernameDoc.exists()) {
          setTestOutput(prev => prev + `✗ Username already exists\n`);
          await signOut(auth);
          return;
        }
        setTestOutput(prev => prev + '✓ Username is available\n');
      } catch (error: any) {
        setTestOutput(prev => prev + `✗ Username check failed: ${error.message}\n`);
        return;
      }
      
      // Step 4: Create user profile
      setTestOutput(prev => prev + 'Step 4: Creating user profile...\n');
      try {
        const now = new Date().toISOString();
        const userProfile = {
          id: newUser.uid,
          username,
          displayName: username,
          avatarUrl: null,
          bio: null,
          role: 'fan',
          createdAt: now,
          updatedAt: now
        };
        
        await setDoc(doc(db, 'user_profiles', newUser.uid), userProfile);
        setTestOutput(prev => prev + '✓ User profile created\n');
      } catch (error: any) {
        setTestOutput(prev => prev + `✗ Profile creation failed: ${error.message}\n`);
        return;
      }
      
      // Step 5: Reserve username
      setTestOutput(prev => prev + 'Step 5: Reserving username...\n');
      try {
        await setDoc(doc(db, 'usernames', username), {
          uid: newUser.uid
        });
        setTestOutput(prev => prev + '✓ Username reserved\n');
      } catch (error: any) {
        setTestOutput(prev => prev + `✗ Username reservation failed: ${error.message}\n`);
        return;
      }
      
      setTestOutput(prev => prev + '\n✓ SIGNUP PROCESS COMPLETED SUCCESSFULLY\n');
      
    } catch (error: any) {
      setTestOutput(prev => prev + `\n✗ UNHANDLED ERROR: ${error.message}\n`);
    }
  };

  // Fonction pour tester la déconnexion avec notre implémentation améliorée
  const testSignOut = async () => {
    setTestOutput('Testing sign out with improved implementation...');
    try {
      const result = await contextSignOut();
      if (result.error) {
        setTestOutput(`Sign out completed with error: ${result.error.message}`);
      } else {
        setTestOutput('Sign out successful');
      }
    } catch (error) {
      setTestOutput(`Sign out failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Authentication Test</h1>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <strong>Authenticated:</strong> {user ? 'Yes' : 'No'}
            </div>
            
            {user && (
              <div className="space-y-2">
                <div><strong>User ID:</strong> {user.uid}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Display Name:</strong> {user.displayName}</div>
                <div><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</div>
              </div>
            )}
            
            {profile && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">User Profile</h3>
                <div><strong>Username:</strong> {profile.username}</div>
                <div><strong>Display Name:</strong> {profile.displayName}</div>
                <div><strong>Role:</strong> {profile.role}</div>
                <div><strong>Created:</strong> {new Date(profile.createdAt).toLocaleString()}</div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {user ? (
              <div className="space-x-2">
                <Button 
                  onClick={() => signOut(auth)}
                  variant="destructive"
                >
                  Direct Sign Out
                </Button>
                <Button 
                  onClick={testSignOut}
                  variant="outline"
                >
                  Improved Sign Out
                </Button>
              </div>
            ) : (
              <p>Not logged in</p>
            )}
          </CardFooter>
        </Card>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Firestore Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={testFirestore}>Test Firestore</Button>
            <Button onClick={testNetworkConnection} variant="outline">Test Network</Button>
          </div>
          {testOutput && (
            <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
              {testOutput}
            </pre>
          )}
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Direct Firebase Signup Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="test@example.com" 
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="password123" 
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="testuser" 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={testDirectSignUp}>Test Direct Signup</Button>
          <Button onClick={testFullSignup} variant="secondary">Test Full Signup</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestAuth; 