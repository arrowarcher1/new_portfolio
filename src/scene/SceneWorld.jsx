import { Sparkles } from '@react-three/drei'
import SkyDome from './SkyDome'
import DayCycle from './DayCycle'
import CloudField from './CloudField'
import Starfield from './Starfield'
import CameraRig from './CameraRig'
import ConvergeIsland from './islands/ConvergeIsland'
import TruthTrailIsland from './islands/TruthTrailIsland'
import ProfPairIsland from './islands/ProfPairIsland'
import Archipelago from './islands/Archipelago'
import {
  HeroShards,
  AboutBlob,
  ExperienceConstellation,
  SkillsOrrery,
  ContactPortal,
} from './setpieces'
import { ANCHORS } from './anchors'
import { FEATURED_PROJECTS } from '../data/content'

const at = (id) => ANCHORS.find((a) => a.id === id).focus

export default function SceneWorld({ reducedMotion, quality }) {
  return (
    <>
      <CameraRig reducedMotion={reducedMotion} />

      {/* Fog color is driven per-frame by DayCycle */}
      <fog attach="fog" args={['#cfe6f4', 20, 95]} />

      <SkyDome />
      <DayCycle />
      <CloudField />
      <Starfield count={quality === 'low' ? 400 : 900} />
      {quality !== 'low' && (
        // Fireflies around the night-time finale
        <Sparkles
          count={140}
          size={2.4}
          speed={0.3}
          opacity={0.65}
          color="#f0abfc"
          scale={[22, 10, 28]}
          position={[0, 1, -118]}
        />
      )}

      <HeroShards position={at('hero')} />
      <AboutBlob position={at('about')} />
      <ExperienceConstellation position={at('experience')} />

      <ConvergeIsland position={at('converge')} color={FEATURED_PROJECTS[0].color} />
      <TruthTrailIsland position={at('truth-trail')} color={FEATURED_PROJECTS[1].color} />
      <ProfPairIsland position={at('profpair')} color={FEATURED_PROJECTS[2].color} />

      <Archipelago position={at('archipelago')} />
      <SkillsOrrery position={at('skills')} />
      <ContactPortal
        position={[at('contact')[0], at('contact')[1] + 3.9, at('contact')[2] - 5]}
      />
    </>
  )
}
