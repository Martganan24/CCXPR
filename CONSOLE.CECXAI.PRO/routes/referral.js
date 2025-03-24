const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient('https://ipdkpskicsvesobhodaz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwZGtwc2tpY3N2ZXNvYmhvZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzE5NjgsImV4cCI6MjA1NzE0Nzk2OH0.LJhXO0GjPYOLRcEk2t2lsmJMewtYwIFc9AxyzbGmT_g');

// Simple referral logic to update referrer's commission and referral count
async function processReferral(referral_code, newUserId) {
  try {
    // Step 1: Find the referrer using the referral code
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id, commission_balance, total_referrals')
      .eq('referral_code', referral_code)
      .single();

    if (referrerError || !referrer) {
      throw new Error('Invalid referral code');
    }

    // Step 2: Add a fixed commission for the referrer
    const commission = 30; // Fixed commission value (simplified)
    
    // Step 3: Update the referrer's commission_balance and total_referrals
    const { error: updateError } = await supabase
      .from('users')
      .update({
        commission_balance: referrer.commission_balance + commission,
        total_referrals: referrer.total_referrals + 1,
      })
      .eq('id', referrer.id);

    if (updateError) {
      throw new Error('Failed to update referrer data');
    }

    // Log success
    console.log(`Referral processed successfully for referrer with ID: ${referrer.id}`);

    return { success: true };
  } catch (error) {
    console.error("Error processing referral:", error.message);
    return { success: false, message: error.message };
  }
}

module.exports = { processReferral };
