import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  badge?: string;
  description: string;
  icon?: string;
  color?: string;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center">
                <div className={`h-4 w-4 rounded-full ${
                  item.color === 'purple' ? 'bg-purple-500' :
                  item.color === 'green' ? 'bg-green-500' :
                  item.color === 'orange' ? 'bg-orange-500' :
                  'bg-purple-500'
                } border border-neutral-300 p-2`} />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-black">
                {item.title}
              </h3>
              <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 md:p-8 shadow-lg border border-neutral-200">
                <div className="flex items-center gap-3 mb-3">
                  {item.icon && (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      item.color === 'purple' ? 'bg-purple-100' :
                      item.color === 'green' ? 'bg-green-100' :
                      item.color === 'orange' ? 'bg-orange-100' :
                      'bg-purple-100'
                    }`}>
                      {item.icon}
                    </div>
                  )}
                  {item.badge && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.badge === 'VERIFIED' ? 'bg-purple-100 text-purple-700' :
                      item.badge === 'RECOMMENDED' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-neutral-800 text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-0.5 bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 to-transparent to-99% mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-linear-to-t from-purple-500 via-purple-500 to-transparent from-0% via-10% rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
