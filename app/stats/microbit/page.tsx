import MicrobitReader from "@/components/microbit/microbitreader";
import StatsSidebar from "@/components/stats/sidebar/statssidebar";

export default function Microbit() {
  return (
    <div className="flex">
      <StatsSidebar />
      <div className="p-5">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Micro:bit Data Reader</h1>
          <MicrobitReader />
        </div>
      </div>
    </div>
  );
}
