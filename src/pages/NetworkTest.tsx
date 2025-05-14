import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { auth, db, firebaseEnv } from '@/lib/firebase';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { CheckCircle, XCircle, AlertTriangle, Network } from 'lucide-react';

// Network test status types
type TestStatus = 'initial' | 'loading' | 'success' | 'error';

const NetworkTest = () => {
  const [generalNetworkStatus, setGeneralNetworkStatus] = useState<TestStatus>('initial');
  const [firebaseAuthStatus, setFirebaseAuthStatus] = useState<TestStatus>('initial');
  const [firestoreStatus, setFirestoreStatus] = useState<TestStatus>('initial');
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [configSummary, setConfigSummary] = useState<string>('');

  useEffect(() => {
    // Display Firebase configuration summary for debugging
    if (firebaseEnv) {
      const summary = `Project ID: ${firebaseEnv.config.projectId}\nMode: ${firebaseEnv.mode}\nProduction: ${firebaseEnv.isProduction ? 'Yes' : 'No'}`;
      setConfigSummary(summary);
    }
  }, []);

  // Add log message with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  // Test general internet connectivity
  const testGeneralConnectivity = async () => {
    setGeneralNetworkStatus('loading');
    addLog('Testing general network connectivity...');
    
    try {
      // Try to fetch from a reliable endpoint
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors',
        // Short timeout to detect network issues quickly
        signal: AbortSignal.timeout(5000)
      });
      
      setGeneralNetworkStatus('success');
      addLog('✓ General network connectivity OK');
      return true;
    } catch (error) {
      setGeneralNetworkStatus('error');
      addLog(`✗ General network error: ${(error as Error).message}`);
      return false;
    }
  };

  // Test Firebase Auth connectivity
  const testFirebaseAuth = async () => {
    setFirebaseAuthStatus('loading');
    addLog('Testing Firebase Auth connectivity...');
    
    try {
      // Try anonymous sign-in as a simple connectivity test
      await signInAnonymously(auth);
      setFirebaseAuthStatus('success');
      addLog('✓ Firebase Auth connectivity OK');
      return true;
    } catch (error) {
      setFirebaseAuthStatus('error');
      addLog(`✗ Firebase Auth error: ${(error as Error).message}`);
      return false;
    }
  };

  // Test Firestore connectivity
  const testFirestore = async () => {
    setFirestoreStatus('loading');
    addLog('Testing Firestore connectivity...');
    
    try {
      // Attempt to read a single document from any collection
      const q = query(collection(db, 'usernames'), limit(1));
      await getDocs(q);
      setFirestoreStatus('success');
      addLog('✓ Firestore connectivity OK');
      return true;
    } catch (error) {
      setFirestoreStatus('error');
      addLog(`✗ Firestore error: ${(error as Error).message}`);
      return false;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    addLog('Starting network diagnostics...');
    
    const hasGeneralConnectivity = await testGeneralConnectivity();
    if (!hasGeneralConnectivity) {
      addLog('⚠️ No general connectivity, skipping Firebase tests');
      return;
    }
    
    await testFirebaseAuth();
    await testFirestore();
    
    addLog('All tests completed.');
  };

  // Get status icon
  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'initial': return null;
      case 'loading': return <Network className="animate-pulse" />;
      case 'success': return <CheckCircle className="text-green-500" />;
      case 'error': return <XCircle className="text-red-500" />;
      default: return <AlertTriangle />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Network Diagnostics</h1>
      
      <div className="mb-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Diagnostic Tool</AlertTitle>
          <AlertDescription>
            This tool helps identify network-related issues with Firebase connectivity.
            Use it when experiencing "auth/network-request-failed" or similar errors.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* General Connectivity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internet Connectivity</CardTitle>
            {getStatusIcon(generalNetworkStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Tests if your device can connect to the internet in general
            </div>
          </CardContent>
        </Card>
        
        {/* Firebase Auth */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firebase Auth</CardTitle>
            {getStatusIcon(firebaseAuthStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Tests connectivity to Firebase Authentication services
            </div>
          </CardContent>
        </Card>
        
        {/* Firestore */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firestore Database</CardTitle>
            {getStatusIcon(firestoreStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Tests connectivity to Firebase Firestore database
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Network Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button onClick={runAllTests} className="w-full mb-2">
                Run All Tests
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={testGeneralConnectivity} variant="outline">
                  Test Internet
                </Button>
                <Button onClick={testFirebaseAuth} variant="outline">
                  Test Auth
                </Button>
                <Button onClick={testFirestore} variant="outline">
                  Test Firestore
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              <p>Firebase config:</p>
              <pre className="mt-1 p-2 bg-slate-100 rounded-md whitespace-pre-wrap">
                {configSummary}
              </pre>
            </div>
          </CardFooter>
        </Card>
        
        {/* Log Output */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto border rounded-md p-2 bg-black text-white">
              {logMessages.length > 0 ? (
                <div className="space-y-1">
                  {logMessages.map((log, index) => (
                    <div key={index} className="text-xs font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center mt-4">
                  Run tests to see diagnostic information
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkTest; 