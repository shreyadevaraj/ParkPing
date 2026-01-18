import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MessageSquare, CheckCircle, AlertOctagon } from 'lucide-react';

export default function PublicPing() {
    const { token } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('IDLE'); // IDLE | SENDING | SENT | ERROR | CALLING | RINGING | CALL_ENDED | COMING | ESCALATED
    const [errorMessage, setErrorMessage] = useState('');
    const [pingLogId, setPingLogId] = useState(null);
    const [pingCount, setPingCount] = useState(0);
    const [firstPingTime, setFirstPingTime] = useState(null);
    const [showEscalate, setShowEscalate] = useState(false);

    useEffect(() => {
        api.get(`/ping/${token}`)
            .then(res => setVehicle(res.data))
            .catch(() => setVehicle(null))
            .finally(() => setLoading(false));
    }, [token]);

    // Polling for status updates
    useEffect(() => {
        if (!pingLogId || (status !== 'SENT' && status !== 'CALL_ENDED')) return;

        const interval = setInterval(async () => {
            try {
                const res = await api.get(`/ping/status/${pingLogId}`);
                if (res.data.status === 'COMING') {
                    setStatus('COMING');
                    clearInterval(interval);
                } else if (res.data.status === 'ESCALATED') {
                    setStatus('ESCALATED');
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [pingLogId, status]);

    // Check for validation/escalation conditions
    useEffect(() => {
        if (pingCount === 0) return;

        // Show escalate if ping count >= 3 OR time > 10 mins
        if (pingCount >= 3) {
            setShowEscalate(true);
        }

        const timer = setInterval(() => {
            if (firstPingTime && (Date.now() - firstPingTime > 10 * 60 * 1000)) { // 10 mins
                setShowEscalate(true);
            }
        }, 10000);

        return () => clearInterval(timer);
    }, [pingCount, firstPingTime]);

    const handlePing = async () => {
        setStatus('SENDING');
        try {
            const res = await api.post(`/ping/${token}`);
            setStatus('SENT');
            setPingLogId(res.data.logId);
            setPingCount(prev => prev + 1);
            if (!firstPingTime) setFirstPingTime(Date.now());
        } catch (error) {
            setStatus('ERROR');
            setErrorMessage(error.response?.data || 'Failed to send notification.');
        }
    };

    const handleCall = async () => {
        setStatus('CALLING');
        try {
            const res = await api.post(`/ping/call/${token}`);
            setStatus('RINGING');
            setPingLogId(res.data.logId);
            setPingCount(prev => prev + 1);
            if (!firstPingTime) setFirstPingTime(Date.now());

            // Simulate ringing/call duration for UI feedback
            setTimeout(() => {
                setStatus('CALL_ENDED');
            }, 5000);
        } catch (error) {
            setStatus('ERROR');
            setErrorMessage(error.response?.data || 'Failed to initiate call.');
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    const handleEscalate = async () => {
        if (!pingLogId) return;
        try {
            await api.post(`/ping/escalate/${pingLogId}`);
            setStatus('ESCALATED');
        } catch (error) {
            alert("Failed to escalate.");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    if (!vehicle) return (
        <div className="h-screen flex items-center justify-center p-4">
            <Card className="text-center max-w-sm">
                <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-2">Invalid QR Code</h1>
                <p className="text-gray-500">This code doesn't seem to exist.</p>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                </div>

                <h1 className="text-2xl font-bold mb-1">{vehicle.name}</h1>
                <p className="text-gray-500 mb-8">is blocking your way?</p>

                {status === 'COMING' ? (
                    <div className="bg-blue-50 text-blue-700 p-6 rounded-xl border border-blue-100 animate-in zoom-in-95">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                            <Car className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold mb-1">On The Way!</h2>
                        <p className="font-medium">The owner is coming.</p>
                        <p className="text-sm opacity-80 mt-2">Please wait a moment.</p>
                    </div>
                ) : status === 'ESCALATED' ? (
                    <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 animate-in zoom-in-95">
                        <AlertOctagon className="w-12 h-12 mx-auto mb-3 text-red-600" />
                        <h2 className="text-xl font-bold mb-1">We apologize for the inconvenience</h2>
                        <p className="font-medium">Help is on the way to unblock your vehicle.</p>
                    </div>
                ) : status === 'SENT' || status === 'CALL_ENDED' ? (
                    <div className="space-y-4">
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 animate-in zoom-in-95">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-semibold">Owner Notified!</p>
                            <p className="text-sm opacity-80 mt-1">Waiting for reply...</p>
                        </div>

                        {showEscalate ? (
                            <Button
                                onClick={handleEscalate}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white shadow-lg animate-pulse"
                            >
                                Owner Unresponsive? Call Management
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setStatus('IDLE')}
                                variant="outline"
                                className="w-full bg-white/50 border-green-200 hover:bg-white text-green-800"
                            >
                                Notify Again ({pingCount})
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {status === 'ERROR' && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                {errorMessage}
                            </div>
                        )}

                        {vehicle.status === 'DND' ? (
                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                                ⚠️ The owner is currently unavailable (DND mode).
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={handleCall}
                                    className="w-full py-6 text-lg bg-green-500 hover:bg-green-600 shadow-xl"
                                    disabled={status !== 'IDLE'}
                                >
                                    Call Owner
                                </Button>
                                <Button
                                    onClick={handlePing}
                                    className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl"
                                    disabled={status !== 'IDLE'}
                                >
                                    Message Owner
                                </Button>
                            </div>
                        )}

                        {status === 'CALLING' && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in fade-in">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <MessageSquare className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Connecting...</h2>
                                <p className="text-gray-400">Please wait while we connect you.</p>
                            </div>
                        )}

                        {status === 'RINGING' && (
                            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50">
                                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce">
                                    <MessageSquare className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Calling...</h2>
                                <p className="text-gray-400">Initiating call to vehicle owner</p>
                            </div>
                        )}

                        <p className="text-xs text-gray-400 mt-4">
                            This notification is anonymous. Your phone number is not shared.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
