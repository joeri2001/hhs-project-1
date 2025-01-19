import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bladbuddy.jpeg"
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="Background image"
          className="blur-sm -z-10"
        />
        <div className="absolute inset-0 bg-green-500 bg-opacity-40" />
      </div>

      <div className="relative -z-10 flex flex-col items-center justify-center min-h-screen text-white p-4">
        <h1 className="text-4xl font-bold mb-4">BladBuddy</h1>
        <p className="text-xl">Moeiteloos tuinieren voor iedereen.</p>
      </div>
    </main>
  );
}
