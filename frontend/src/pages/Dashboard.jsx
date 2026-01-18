import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import QRCodeModal from '../components/ui/QRCodeModal';
import { Plus, Power, Trash2, Car, Bike, MoreHorizontal } from 'lucide-react';

export default function Dashboard() {
    const { logout } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Add Vehicle Form State
    const [newVehicleName, setNewVehicleName] = useState('');
    const [newVehicleType, setNewVehicleType] = useState('FOUR_WHEELER');

    // QR Code Modal State
    const [selectedVehicleForQr, setSelectedVehicleForQr] = useState(null);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data);
        } catch (error) {
            console.error('Failed to load vehicles');
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', {
                name: newVehicleName,
                type: newVehicleType
            });
            setNewVehicleName('');
            setNewVehicleType('FOUR_WHEELER');
            setIsAddModalOpen(false);
            loadVehicles();
        } catch (error) {
            alert('Failed to add vehicle');
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.put(`/vehicles/${id}/status`);
            loadVehicles();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const deleteVehicle = async (id) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            await api.delete(`/vehicles/${id}`);
            loadVehicles();
        } catch (error) {
            alert('Failed to delete vehicle');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'TWO_WHEELER': return <Bike className="w-6 h-6" />;
            case 'FOUR_WHEELER': return <Car className="w-6 h-6" />;
            default: return <Car className="w-6 h-6" />;
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
            {/* Minimal Header */}
            <nav className="fixed top-0 w-full z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="font-bold text-2xl tracking-tighter">ParkPing</div>
                    <Button variant="ghost" onClick={logout} className="text-sm font-medium hover:bg-gray-50">Log out</Button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Dashboard</h1>
                        <p className="text-xl text-gray-500 font-light tracking-wide max-w-2xl">Manage your fleet and notifications with ease.</p>
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-black text-white hover:bg-gray-800 rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add New Vehicle
                    </Button>
                </div>

                {vehicles.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Car className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No vehicles yet</h3>
                        <p className="text-gray-500 mt-1 mb-6">Add your first vehicle to get started with ParkPing.</p>
                        <Button onClick={() => setIsAddModalOpen(true)} variant="outline">
                            Add Vehicle
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map(vehicle => (
                            <div key={vehicle.id} className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-200">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                        {getIcon(vehicle.type)}
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${vehicle.status === 'ACTIVE'
                                        ? 'bg-white border-green-200 text-green-700'
                                        : 'bg-white border-red-200 text-red-700'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        {vehicle.status}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1 tracking-tight">{vehicle.name}</h3>
                                <p className="text-xs text-gray-400 font-mono mb-8 opacity-60">ID: {vehicle.qrToken?.substring(0, 8)}...</p>

                                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-sm border-gray-200 hover:border-black hover:bg-transparent"
                                        onClick={() => setSelectedVehicleForQr(vehicle)}
                                    >
                                        Show QR Code
                                    </Button>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => toggleStatus(vehicle.id)}
                                            className="p-2.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
                                            title={vehicle.status === 'ACTIVE' ? "Disable Notifications" : "Enable Notifications"}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteVehicle(vehicle.id)}
                                            className="p-2.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                            title="Delete Vehicle"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Vehicle Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Vehicle"
            >
                <form onSubmit={handleAddVehicle} className="space-y-6 pt-2">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'TWO_WHEELER', label: '2 Wheeler', icon: Bike },
                                    { id: 'FOUR_WHEELER', label: '4 Wheeler', icon: Car },
                                    { id: 'OTHER', label: 'Other', icon: MoreHorizontal }
                                ].map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setNewVehicleType(type.id)}
                                        className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${newVehicleType === type.id
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        <type.icon className="w-5 h-5" />
                                        <span className="text-xs font-medium">{type.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Name</label>
                            <Input
                                placeholder="e.g. My Honda City"
                                value={newVehicleName}
                                onChange={(e) => setNewVehicleName(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 text-white rounded-lg">
                        Add Vehicle
                    </Button>
                </form>
            </Modal>

            {/* QR Code Modal */}
            {selectedVehicleForQr && (
                <QRCodeModal
                    isOpen={!!selectedVehicleForQr}
                    onClose={() => setSelectedVehicleForQr(null)}
                    vehicleName={selectedVehicleForQr.name}
                    qrToken={selectedVehicleForQr.qrToken}
                />
            )}
        </div>
    );
}
