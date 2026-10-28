const CHEF_DETAILS = {
  name: "Chef Vishal",
  title: "Head Chef",
  bio: "Over 12 years of culinary expertise crafting authentic North Indian and Awadhi pure vegetarian masterpieces with traditional spices.",
  imageUrl: '/assets/chef.png',
};

const OWNER_DETAILS = {
  name: "Vikas Saini",
  title: "Owner of Majedaar Restaurent",
  bio: "Dedicated restaurateur committed to genuine hospitality, pristine hygiene, and the finest 100% pure vegetarian dining in Ayodhya.",
  imageUrl: '/assets/owner.png',
};

const RestaurantStory = () => {
  const activeChef = CHEF_DETAILS;
  const activeOwner = OWNER_DETAILS;

  return (
    <section className="w-full bg-[#F2F7F4] py-16 sm:py-24 border-b border-stone-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Story Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B3B2B] tracking-tight mb-5">
            Authentic Cooking, Prepared Fresh Daily
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
            At Majedaar Restaurant, we take pride in serving genuine flavors straight to your
            table or doorstep. Our kitchen prepares each meal with love and uncompromising attention
            to detail, ensuring every bite is a celebration of taste. Experience the essence of
            traditional Indian cooking, 100% pure vegetarian, made fresh for you every day.
          </p>
          <div className="flex justify-center gap-6 text-xs sm:text-sm font-semibold text-[#1B3B2B] mt-6">
            {["Order", "Eat", "Enjoy"].map((word) => (
              <div key={word} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C85A17]"></span>
                <span>{word}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership & Culinary Pillars (Chef & Owner) */}
        <div className="border-t border-stone-200/80 pt-12 sm:pt-16">
          <div className="text-center mb-10">
            <h3 className="font-hero text-2xl sm:text-3xl font-bold text-[#1B3B2B]">
              Meet Our Leadership
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Chef Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all hover:shadow-xs">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-stone-100 flex-none border-2 border-emerald-100 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeChef.imageUrl}
                  alt={activeChef.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_CHEF.imageUrl;
                  }}
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#1B3B2B]/10 text-[#1B3B2B] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                  Master of Cuisine
                </span>
                <h4 className="font-heading text-lg sm:text-xl font-bold text-[#11261B]">
                  {activeChef.name}
                </h4>
                <p className="text-xs font-semibold text-[#C85A17] mb-2.5">
                  {activeChef.title}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {activeChef.bio}
                </p>
              </div>
            </div>

            {/* Owner Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all hover:shadow-xs">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-stone-100 flex-none border-2 border-amber-100 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeOwner.imageUrl}
                  alt={activeOwner.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_OWNER.imageUrl;
                  }}
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#C85A17]/10 text-[#C85A17] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                  Founder
                </span>
                <h4 className="font-heading text-lg sm:text-xl font-bold text-[#11261B]">
                  {activeOwner.name}
                </h4>
                <p className="text-xs font-semibold text-[#1B3B2B] mb-2.5">
                  {activeOwner.title}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {activeOwner.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantStory;
