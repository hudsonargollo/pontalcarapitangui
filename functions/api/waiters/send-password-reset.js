/**
 * Send password reset link via WhatsApp
 * POST /api/waiters/send-password-reset
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);

    // Parse request body
    const body = await request.json();
    const { waiterId, waiterEmail, waiterName, phoneNumber } = body;

    if (!waiterId || !waiterEmail || !phoneNumber) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
      env.VITE_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user is admin by checking auth metadata
    if (user.user_metadata?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden - admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate password reset link
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: waiterEmail
    });

    if (resetError) {
      console.error('Error generating reset link:', resetError);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate password reset link'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format phone number for WhatsApp (remove non-digits, add country code if needed)
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }

    // Send WhatsApp message with reset link
    const message = `Olá ${waiterName}! 👋\n\nClique no link abaixo para redefinir sua senha:\n\n${resetData.properties.action_link}\n\nEste link expira em 1 hora.\n\nPONTAL Carapitangui`;

    // For now, just log the message (WhatsApp integration would go here)
    console.log(`WhatsApp message to ${formattedPhone}:`, message);

    // TODO: Integrate with WhatsApp API (Baileys or official API)
    // For now, we'll just return success and the admin can send manually if needed

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Password reset link generated',
      resetLink: resetData.properties.action_link,
      phoneNumber: formattedPhone,
      note: 'WhatsApp integration pending - link generated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-password-reset:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
