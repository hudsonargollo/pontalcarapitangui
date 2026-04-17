-- Create notification templates table for configurable WhatsApp message content
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notification_templates_template_type ON notification_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_notification_templates_is_active ON notification_templates(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON notification_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read templates
CREATE POLICY "Authenticated users can read notification_templates" ON notification_templates
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to update templates (admin functionality)
CREATE POLICY "Authenticated users can update notification_templates" ON notification_templates
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for service role to manage templates
CREATE POLICY "Service role can manage notification_templates" ON notification_templates
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert default Brazilian Portuguese message templates
INSERT INTO notification_templates (template_type, content, variables) VALUES 
(
  'payment_confirmed',
  'Olá {{customerName}}! 🎉 Seu pagamento foi confirmado!\n\n📋 Pedido: #{{orderNumber}}\n💰 Valor: R$ {{orderTotal}}\n⏰ Tempo estimado: {{estimatedTime}} minutos\n\n📍 Coco Loko Açaiteria\nAguarde, estamos preparando seu pedido com muito carinho! 🥥',
  '["customerName", "orderNumber", "orderTotal", "estimatedTime"]'
),
(
  'preparing',
  'Oi {{customerName}}! 👨‍🍳 Seu pedido está sendo preparado!\n\n📋 Pedido: #{{orderNumber}}\n⏰ Tempo estimado: {{estimatedTime}} minutos\n\n🥥 Estamos caprichando no seu açaí! Em breve estará pronto para retirada.',
  '["customerName", "orderNumber", "estimatedTime"]'
),
(
  'ready',
  'Pronto! 🎉 {{customerName}}, seu pedido está pronto para retirada!\n\n📋 Pedido: #{{orderNumber}}\n📍 Coco Loko Açaiteria\n\n🥥 Venha buscar seu açaí fresquinho! Estamos te esperando! 😊',
  '["customerName", "orderNumber"]'
),
(
  'custom',
  'Olá {{customerName}}! 📱 Mensagem da Coco Loko Açaiteria:\n\n{{customMessage}}\n\n📍 Qualquer dúvida, estamos aqui para ajudar!',
  '["customerName", "customMessage"]'
);

-- Add table and column comments
COMMENT ON TABLE notification_templates IS 'Configurable message templates for WhatsApp notifications in Brazilian Portuguese';
COMMENT ON COLUMN notification_templates.template_type IS 'Type of notification: payment_confirmed, preparing, ready, custom';
COMMENT ON COLUMN notification_templates.content IS 'Message template with {{variable}} placeholders';
COMMENT ON COLUMN notification_templates.variables IS 'JSON array of available variables for template rendering';
COMMENT ON COLUMN notification_templates.is_active IS 'Whether this template is currently active and should be used';