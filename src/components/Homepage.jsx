import React from 'react';
import Hero from './Hero';
import WasteRealization from './WasteRealization';
import SystemLoop from './SystemLoop';
import ProductConfigurator from './ProductConfigurator';
import PWADemo from './PWADemo';
import SystemImpact from './SystemImpact';
import OperatorTrust from './OperatorTrust';
import JournalFeed from './JournalFeed';

export function Homepage({ activeVariant, onColorwayChange, setRoute }) {
  return (
    <div id="homepage-scrolly-container">
      {/* Narrative Section Wipes (Chapters 1 - 9) */}
      <Hero setRoute={setRoute} />
      <WasteRealization />
      <SystemLoop />
      <ProductConfigurator activeVariant={activeVariant} onColorwayChange={onColorwayChange} />
      <PWADemo />
      <SystemImpact />
      <OperatorTrust />
      <JournalFeed />
    </div>
  );
}

export default Homepage;
