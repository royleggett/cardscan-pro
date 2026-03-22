const DEMO_EMAIL = "demo.cardscanpro@gmail.com";

export const isDemoUser = (user) => {
  return user?.email === DEMO_EMAIL;
};

export const showDemoRestriction = () => {
  alert("⚠️ Demo Mode: This action is disabled in demo mode. Create your own account to use all features!");
};