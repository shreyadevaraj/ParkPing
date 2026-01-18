
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Download, X } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, vehicleName, qrToken }) {
    const qrUrl = `http://192.168.0.116:5173/ping/${qrToken}`;

    const downloadQRCode = () => {
        const svg = document.getElementById("vehicle-qrcode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${vehicleName}-qrcode.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`QR Code: ${vehicleName}`}>
            <div className="flex flex-col items-center justify-center p-4 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <QRCodeSVG
                        id="vehicle-qrcode"
                        value={qrUrl}
                        size={256}
                        level={"H"}
                        includeMargin={true}
                    />
                </div>

                <p className="text-sm text-gray-500 text-center max-w-xs">
                    Scan this code to notify the owner of this vehicle.
                </p>

                <div className="flex w-full gap-3">
                    <Button onClick={downloadQRCode} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                    </Button>
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
