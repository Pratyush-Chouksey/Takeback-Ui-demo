import React, { useRef, useState } from 'react';
import MagneticButton from './MagneticButton';
import pdpLifestyle from '../assets/pdp_lifestyle.png';

export function About() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section 
      id="about-archive-section"
      className="min-h-screen w-full bg-[#F7F5F0] text-[#0B0F12] pt-28 pb-20 flex flex-col items-center justify-center spring-transition"
    >
      <div className="max-w-[1440px] mx-auto w-full px-5 lg:px-20 flex flex-col">
        
        {/* Editorial Heading Column Grid */}
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 text-center md:text-left">
          <span className="text-xs font-mono tracking-[0.2em] text-[#A3E2C9] bg-[#0B0F12] px-3.5 py-1.5 rounded-full inline-block self-center md:self-start font-bold uppercase">
            ARCHIVE // FOUNDER STORY
          </span>
          <h1 className="display-header text-4xl md:text-6xl font-black text-[#0B0F12] leading-[1.05] uppercase tracking-tight">
            OUR STORY SO FAR.
          </h1>
          <p className="interface-text text-lg text-[#0B0F12]/70 font-semibold italic border-l-4 border-[#A3E2C9] pl-4 py-1 leading-relaxed">
            Eliminating single-use coffee cups across India through a community-powered share loop.
          </p>
        </div>

        {/* Media Embedding Panel (Responsive 16:9 Aspect Ratio) */}
        <div 
          className="relative w-full overflow-hidden shadow-2xl border border-black/10 group cursor-pointer"
          style={{
            aspectRatio: '16/9',
            maxWidth: '1024px',
            borderRadius: '12px',
            margin: '40px auto'
          }}
          onClick={togglePlay}
        >
          {/* Custom mock video element */}
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            loop
            src="https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-machine-brewing-espresso-41666-large.mp4"
            poster={pdpLifestyle}
          />

          {/* Overlay mask */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:bg-black/55">
              <div className="w-20 h-20 rounded-full bg-[#F7F5F0]/90 text-[#0B0F12] flex items-center justify-center shadow-lg transition-transform duration-500 scale-100 group-hover:scale-110">
                <svg className="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-[#F7F5F0] uppercase font-bold">
                PLAY ORIGIN DOCUMENTARY (3 MIN)
              </span>
            </div>
          )}

          {/* HUD Overlay details for documentary video player */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-center text-[9px] font-mono text-[#F7F5F0]/70 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>DOCUMENTARY MOCK INTERFACE v2.0</span>
            <span>{isPlaying ? 'PAUSE STREAM' : 'READY TO PLAY'}</span>
          </div>
        </div>

        {/* Editorial Book-Style Columns Layout */}
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">
          
          <div className="interface-text text-base md:text-[17px] text-[#0B0F12]/80 leading-[1.60] space-y-6">
            <p>
              It all started on a crisp morning at my local beach in Goa back in 2024. I was sitting on the sand, watching the surf roll in, cradling my morning flat white. It’s a ritual that millions of us share—a moment of quiet pause before the day begins, fueled by the rich, comforting warmth of a good brew. But as the sun climbed higher, I noticed something else dotting the shoreline. Tucked into the rocks and half-buried in the sand were paper takeaway cups. Dozens of them. That morning, the magic of my daily ritual was broken by a stark reality: our love for coffee was leaving a devastating mark on the places we cherish most.
            </p>
            
            <p>
              When I looked into the numbers, the scale of the issue blew me away. In India alone, we go through over one billion single-use coffee cups every single year. Most people believe these cups are harmlessly composted or recycled, but the reality is far more challenging. Almost all takeaway cups are lined with a thin, heat-bonded polyethylene plastic film to keep them waterproof. Because of this laminate, they cannot be recycled through standard facilities, meaning nearly every single cup ended up in a landfill or scattered across our coastlines and bushlands.
            </p>
            
            <p className="border-l-2 border-[#0B0F12] pl-6 py-2 my-8 font-serif text-xl md:text-2xl font-semibold italic text-[#0B0F12]/90">
              "We realized that the solution wasn't just to make a better cup, but to build a seamless utility loop that respects both cafe speed and local convenience."
            </p>

            <p>
              I knew we couldn't go on like this, but I also knew that asking everyone to carry reusable cups everywhere wasn't working. Life gets busy, we forget our flasks in the car, or we decide on a coffee spur of the moment. We didn't need to change people's love for coffee; we needed to change the system around it. That’s how the idea for TakeBack was born. I wanted to build a simple, circular network where a reusable cup could be borrowed at one cafe and returned at any other, making reuse the absolute easiest choice for every Indian.
            </p>
            
            <p>
              We gathered a passionate team of local designers, material scientists, and cafe owners. We spent months sketching, testing, and refining. We wanted a cup that felt amazing to hold, insulated the coffee beautifully, and stood up to the rigors of daily commercial washing. The result was our signature husk vessel—crafted from upcycled coffee husks that would otherwise go to waste, combined with food-grade circular poly-composites. It is beautiful, durable, and designed to circulate for thousands of wash cycles.
            </p>
            
            <p>
              But a great cup is only half the loop. We engineered a seamless, connected system of smart return bins and cafe drop points. By placing these return drawers at neighborhood cafes, campus hubs, and transit stations, we’ve created a frictionless network. A quick scan of the base QR code registers your cup, and returning it takes just seconds, rewarding you with ₹15 cashback directly to your wallet. It's a self-sustaining ecosystem built on community, trust, and shared responsibility.
            </p>
            
            <p>
              From our humble beginnings in a single coastal cafe, TakeBack has grown into a thriving network of over 140 nodes across India's capital cities and regional hubs. We’re incredibly proud to partner with legendary roasters and local cafes who share our vision of a clean, circular future. For us, TakeBack isn’t about compromising on convenience or guilt-tripping coffee drinkers; it's about celebrating our incredible coffee culture while keeping India’s beautiful landscapes clean for generations to come. Every cup borrowed is one less cup binned, and together, we are closing the loop on waste.
            </p>

            <p className="border-t border-black/10 pt-6 mt-6 text-sm text-[#0B0F12]/75">
              <strong>Sustainability Credentials:</strong> TakeBack is built on rigorous environmental standards and is currently undergoing certification as a Certified B Corporation (Pending Real Certification). We are committed to verifying our social and environmental performance, accountability, and transparency at every level of our operations.
            </p>
          </div>

          {/* Founder Signature section */}
          <div className="border-t border-black/10 pt-8 mt-4 flex justify-between items-center flex-wrap gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-black/40 uppercase">DOCUMENT COMPILED BY</span>
              <span className="text-sm font-bold text-[#0B0F12] font-serif">TakeBack Founders & Labs</span>
              <span className="text-xs text-black/50 font-mono">June 2026 // Goa</span>
            </div>
            
            <div className="flex gap-3">
              <MagneticButton 
                onClick={() => window.open('https://github.com', '_blank')}
                className="px-4 py-2 border border-black/15 hover:border-black text-[#0B0F12] text-xs font-semibold rounded-md font-sans bg-transparent cursor-pointer spring-transition"
                style={{ minHeight: '48px' }}
              >
                Inspect System Whitepaper
              </MagneticButton>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-black/10 pt-12 mt-12 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono tracking-[0.2em] text-[#A3E2C9] bg-[#0B0F12] px-3.5 py-1.5 rounded-full inline-block self-start font-bold uppercase">
                {/* TODO: confirm with founder */}
                FAQ // THE BORROW-RETURN LOOP
              </span>
              <h2 className="display-header text-2xl md:text-3xl font-black text-[#0B0F12] uppercase tracking-tight">
                {/* TODO: confirm with founder */}
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: "How does the TakeBack borrow and return system work?",
                  a: "Order your drink at any partner café in a TakeBack cup. Scan the base QR code to borrow it. Enjoy your coffee on the go, then drop the cup in any network smart bin. Your deposit is instantly refunded to your digital wallet."
                },
                {
                  q: "Is there a cost or deposit required to borrow a cup?",
                  a: "Yes. We hold a fully refundable deposit of ₹50.00 per cup to keep the loop sustainable. Once you return the cup to any smart bin drop node, the deposit is instantly credited back to your linked payment method."
                },
                {
                  q: "How are TakeBack cups sanitized between borrows?",
                  a: "Every returned cup goes through a medical-grade commercial sanitization cycle at a minimum of 82°C. This meets and exceeds all global hospitality hygiene standards, ensuring your next cup is perfectly clean, safe, and sterile."
                },
                {
                  q: "What materials are the cups made from?",
                  a: "The cups are crafted from organic upcycled coffee husks blended with food-grade circular poly-composites. They are 100% BPA-free, certified non-toxic, and built to withstand over 10,000 commercial wash cycles without any structural degradation."
                },
                {
                  q: "Where can I return my borrowed TakeBack cup?",
                  a: "You can drop it at any smart return bin node or participating café in our network. Open the live map in our app to locate return stations and partner cafés near you."
                },
                {
                  q: "What happens to a cup when it reaches its end of life?",
                  a: "Once a cup completes its lifespan of 10,000 washes, we don't throw it away. We gather them for circular recycling, grinding the material down to manufacture new smart collection bins and return nodes."
                }
              ].map((faq, i) => (
                <div key={i} className="p-5 bg-white/50 border border-black/5 rounded-xl flex flex-col gap-2 text-left">
                  <h3 className="font-serif text-base font-bold text-[#0B0F12]">
                    {/* TODO: confirm with founder */}
                    {faq.q}
                  </h3>
                  <p className="interface-text text-sm text-[#0B0F12]/75 leading-relaxed">
                    {/* TODO: confirm with founder */}
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default About;
