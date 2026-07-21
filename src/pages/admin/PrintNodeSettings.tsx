import { useState, useEffect } from 'react';
import { printNodeClient } from '@/integrations/printnode/client';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer, Check, X, RefreshCw } from 'lucide-react';

interface Printer {
  id: number;
  name: string;
  description: string;
  state: string;
}

const PrintNodeSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">PrintNode Settings</h2>
            <p className="text-gray-600">Configure PrintNode integration here.</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PrintNodeSettings;
