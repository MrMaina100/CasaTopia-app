import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";



let allTabs = [ 
  {
    id: "home",
   name:'Home',
    link:'/'
  },
  {
    id: "offers",
    name: "Offers",   
    link:'/offers'
  },
  {
    id: "profile",
    name:'Profile',
    link:'/profile'
  },
 
];

export const SlidingTabBar = () => {
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  useEffect(() => {
    if (activeTabIndex === null) {
      return;
    }

    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };

    setTabPosition();
  }, [activeTabIndex]);

  return (
    <div className="flex flew-row items-center justify-center space-x-3  relative   h-12 rounded-3xl border bg-white text-black border-black/40  px-2 pr-8 backdrop-blur-sm w-[22rem]">
      <span
        className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all duration-300"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span className="h-full w-full rounded-3xl bg-gray-200/30" />
      </span>
      {allTabs.map((tab, index) => {
        const isActive = activeTabIndex === index;

        return (
         <div key={tab.id} className="items-center ">
            <button
            key={index}
            ref={(el) => (tabsRef.current[index] = el)}
            className={`${
              isActive ? `` : `hover:text-neutral-300`
            } my-auto cursor-pointer select-none rounded-full px-4 text-center `}
            onClick={() => setActiveTabIndex(index)}
          >
            <Link to={tab.link} >
           
               {tab.name}
            
            </Link>
          </button>

         </div>
       
        );
      })}
       
        
       
      

      
    </div>
  );
};
