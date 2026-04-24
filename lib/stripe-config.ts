// Stripe設定とモックモード

export const STRIPE_CONFIG = {
  // Stripeキーが設定されているかチェック
  isConfigured: () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    return (
      secretKey && 
      publishableKey && 
      !secretKey.includes('your_stripe') &&
      !secretKey.includes('test_key_replace')
    );
  },
  
  // モックモードかどうか
  isMockMode: () => {
    return !STRIPE_CONFIG.isConfigured();
  },
  
  // テストカード番号
  TEST_CARD: '4242424242424242',
};

// モック用のPayment Intent ID生成
export function generateMockPaymentIntentId(): string {
  return `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// モック用のClient Secret生成
export function generateMockClientSecret(): string {
  return `${generateMockPaymentIntentId()}_secret_${Math.random().toString(36).substr(2, 9)}`;
}
