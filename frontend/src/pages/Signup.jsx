import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export default function Signup() {
    const [step, setStep] = useState('DETAILS'); // DETAILS | OTP
    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [vehicleType, setVehicleType] = useState('FOUR_WHEELER');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const { sendSignupOtp, register } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await sendSignupOtp(`${countryCode}${phone}`);
            setStep('OTP');
        } catch (error) {
            setError(error.response?.data || 'Failed to send OTP');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, `${countryCode}${phone}`, otp, "", "FOUR_WHEELER");
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Create Account</h2>
                    <p className="text-gray-500">Join ParkPing to manage your vehicle notifications.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                {step === 'DETAILS' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <Input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <div className="flex gap-2">
                                <select
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white font-medium"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    <option value="+91">🇮🇳 +91</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+971">🇦🇪 +971</option>
                                </select>
                                <Input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="flex-1"
                                />
                            </div>
                        </div>



                        <Button type="submit" className="w-full mt-4">
                            Next
                        </Button>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Already have an account? <Link to="/login" className="text-black font-semibold hover:underline">Login</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Verification Code</label>
                            <Input
                                type="text"
                                placeholder="Enter 4-digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">Sent to {countryCode}{phone}</p>
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                        <button
                            type="button"
                            onClick={() => setStep('DETAILS')}
                            className="w-full text-sm text-gray-500 hover:text-black mt-4"
                        >
                            Edit Details
                        </button>
                    </form>
                )}
            </Card>
        </div>
    );
}
