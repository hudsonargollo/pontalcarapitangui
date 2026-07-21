import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  Bell,
  Lock,
  Database,
  CheckCircle,
  RefreshCw,
  Download,
  PlayCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { printServerClient } from '@/integrations/print-server/client';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  // Printer settings state
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [printerStatus, setPrinterStatus] = useState<any>(null);

  useEffect(() => {
    document.title = 'Configurações — PONTAL Carapitangui';
    // Load saved printer URL
    const saved = printServerClient.getServerUrl();
    setServerUrl(saved);
    checkPrinterConnection();
  }, []);

  const checkPrinterConnection = async () => {
    setIsChecking(true);
    try {
      const available = await printServerClient.checkAvailability();
      setIsConnected(available);
      
      if (available) {
        const status = await printServerClient.getStatus();
        setPrinterStatus(status);
        toast.success('Servidor de impressão conectado!');
      } else {
        setPrinterStatus(null);
        toast.error('Servidor de impressão não encontrado');
      }
    } catch (error) {
      setIsConnected(false);
      setPrinterStatus(null);
      toast.error('Erro ao conectar ao servidor');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSavePrinterUrl = () => {
    printServerClient.setServerUrl(serverUrl);
    toast.success('URL salva com sucesso!');
    checkPrinterConnection();
  };

  const handleTestPrint = async () => {
    setIsTesting(true);
    try {
      const response = await fetch(`${serverUrl}/test-print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Impressão de teste enviada!');
      } else {
        const error = await response.json();
        toast.error(`Erro: ${error.message || 'Falha na impressão'}`);
      }
    } catch (error) {
      toast.error('Erro ao enviar impressão de teste');
    } finally {
      setIsTesting(false);
    }
  };

  const handleReconnect = async () => {
    try {
      const response = await fetch(`${serverUrl}/reconnect`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Impressora reconectada!');
        checkPrinterConnection();
      } else {
        toast.error('Erro ao reconectar impressora');
      }
    } catch (error) {
      toast.error('Erro ao reconectar');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configurações do Sistema
          </h1>
          <p className="text-gray-600 mt-2">Gerencie as configurações gerais da aplicação</p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-lg">
            <TabsTrigger value="general" className="rounded-lg">Geral</TabsTrigger>
            <TabsTrigger value="printer" className="rounded-lg">Impressora</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg">Notificações</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg">Segurança</TabsTrigger>
            <TabsTrigger value="database" className="rounded-lg">Banco de Dados</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card className="rounded-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Configurações Gerais</CardTitle>
                <CardDescription>Informações básicas do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Versão da Aplicação</p>
                    <p className="text-lg font-semibold text-gray-900">1.0.0</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ambiente</p>
                    <p className="text-lg font-semibold text-gray-900">Produção</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Banco de Dados</p>
                    <p className="text-lg font-semibold text-gray-900">Supabase</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="text-lg font-semibold text-green-600">✓ Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Printer Settings */}
          <TabsContent value="printer" className="space-y-4">
            <Card className="rounded-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Configuração de Impressora Térmica</CardTitle>
                <CardDescription>Gerencie o servidor de impressão para recibos e pedidos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Connection Status */}
                <div className="p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-semibold text-gray-900">Status do Servidor</p>
                        <p className="text-sm text-gray-600">Servidor local de impressão térmica</p>
                      </div>
                    </div>
                    <Badge className={isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {isConnected ? '✓ Conectado' : '✗ Desconectado'}
                    </Badge>
                  </div>
                </div>

                {/* Server URL Configuration */}
                <div className="space-y-3">
                  <Label htmlFor="serverUrl" className="font-semibold">URL do Servidor</Label>
                  <div className="flex gap-2">
                    <Input
                      id="serverUrl"
                      type="text"
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      placeholder="http://localhost:3001"
                      className="rounded-lg"
                    />
                    <Button
                      onClick={handleSavePrinterUrl}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-lg"
                    >
                      Salvar
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={checkPrinterConnection}
                    disabled={isChecking}
                    variant="outline"
                    className="rounded-lg h-12 flex items-center justify-center gap-2"
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Verificar Conexão
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleTestPrint}
                    disabled={isTesting || !isConnected}
                    variant="outline"
                    className="rounded-lg h-12 flex items-center justify-center gap-2"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Imprimindo...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        Teste de Impressão
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReconnect}
                    disabled={!isConnected}
                    variant="outline"
                    className="rounded-lg h-12 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reconectar
                  </Button>
                </div>

                {/* Printer Status Info */}
                {printerStatus && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Informações da Impressora:</p>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>Status: {printerStatus.status || 'Desconhecido'}</p>
                      {printerStatus.model && <p>Modelo: {printerStatus.model}</p>}
                      {printerStatus.paperStatus && <p>Papel: {printerStatus.paperStatus}</p>}
                    </div>
                  </div>
                )}

                {/* Installation Guide */}
                <div className="space-y-3 pt-4 border-t">
                  <p className="font-semibold text-gray-900">Guia de Instalação</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>1. Baixe os arquivos necessários para instalar o servidor de impressão</p>
                    <p>2. Execute o script de instalação no seu computador</p>
                    <p>3. Configure a URL do servidor acima</p>
                    <p>4. Clique em "Verificar Conexão" para confirmar</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => toast.info('Acesse o repositório GitHub para baixar os arquivos')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Arquivos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="rounded-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Configurações de Notificações</CardTitle>
                <CardDescription>Gerencie as notificações do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-gray-900">Notificações WhatsApp</p>
                        <p className="text-sm text-gray-600">Enviar notificações via WhatsApp</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-gray-900">Notificações de Pedidos</p>
                        <p className="text-sm text-gray-600">Alertas de novos pedidos</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card className="rounded-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Configurações de Segurança</CardTitle>
                <CardDescription>Gerencie a segurança da aplicação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-blue-900">Autenticação Segura</p>
                        <p className="text-sm text-blue-800 mt-1">
                          A aplicação utiliza autenticação segura via Supabase com criptografia de ponta a ponta.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900">Controle de Acesso</p>
                        <p className="text-sm text-green-800 mt-1">
                          Sistema de roles e permissões implementado para proteger dados sensíveis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database" className="space-y-4">
            <Card className="rounded-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Banco de Dados</CardTitle>
                <CardDescription>Informações e configurações do banco de dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900">Banco de Dados Seguro</p>
                        <p className="text-sm text-green-800 mt-1">
                          Todos os dados são armazenados com segurança no Supabase com backups automáticos diários.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Provedor</p>
                      <p className="text-lg font-semibold text-gray-900">Supabase (PostgreSQL)</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Replicação</p>
                      <p className="text-lg font-semibold text-gray-900">Automática</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Backups</p>
                      <p className="text-lg font-semibold text-gray-900">Diários</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Criptografia</p>
                      <p className="text-lg font-semibold text-gray-900">SSL/TLS</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
