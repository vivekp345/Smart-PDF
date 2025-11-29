import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f1216] relative overflow-hidden">
      
      {/* Background Ambience (Gradients) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#9C27B0]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6FFFB0]/10 rounded-full blur-[120px]" />

      <div className="z-10 w-full flex justify-center px-4">
        <AuthForm />
      </div>

    </div>
  );
};

export default AuthPage;