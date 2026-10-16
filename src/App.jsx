import DiscoverSection from './components/DiscoverSection'
import SkillsSection from './components/SkillsSection'
import ToolsSection from './components/ToolsSection'
import ProcessSection from './components/ProcessSection'
import ProjectsSection from './components/ProjectsSection'
import PricingSection from './components/PricingSection'
import ContactSection from './components/ContactSection'
import SiteFooter from './components/SiteFooter'
import HeroGlass from './components/HeroGlass'
import MotionEnhancements from './components/MotionEnhancements'

/**
 * Hero → About → Services → Tools → Process → Projects → Pricing → Contact → Footer
 */
export default function App() {
  return (
    <div className="app">
      <MotionEnhancements />
      <HeroGlass />

      <DiscoverSection />
      <SkillsSection />
      <ToolsSection />
      <ProcessSection />
      <ProjectsSection />
      <PricingSection />
      <ContactSection />
      <SiteFooter />
    </div>
  )
}
