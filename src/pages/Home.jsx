import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HistoryImage from '../assets/images/historia.png';
import badge from '../assets/images/selo.png';
import HistorySection from '../components/HistorySection';
import heroImage from '../assets/images/tortaFrango.png';
import MenuPreview from '../components/MenuPreview';
import JoinFamilySection from '../components/JoinFamilySection';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero
          title="A melhor torta de frango do Mundo"
          subtitle="Agora pode ser sua oportunidade de negócio, transforme cada fatia em sucesso!"
          ctaLabel="Seja um revendedor"
          ctaHref="https://wa.me/5519984380002?text=Oi%20tudo%20bem%20%3F%21%20Gostaria%20de%20saber%20mais%20como%20ser%20um%20revendedor%20%21"
          productImage={heroImage}
          badgeImage={badge}
        />
        <HistorySection imageSrc={HistoryImage} />
        <MenuPreview />
        <JoinFamilySection />
      </main>
      <Footer />
    </>
  );
}

export default Home;


