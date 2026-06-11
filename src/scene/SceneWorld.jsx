import { Sparkles } from '@react-three/drei'
import VoidBackground from './VoidBackground'
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

      <fog attach="fog" args={['#0a0518', 18, 80]} />
      <ambientLight color="#4c3a78" intensity={0.7} />
      <directionalLight position={[8, 12, 6]} color="#cfc2ef" intensity={0.5} />

      <VoidBackground />
      <Starfield count={quality === 'low' ? 400 : 900} />
      {quality !== 'low' && (
        <Sparkles
          count={220}
          size={2.2}
          speed={0.25}
          opacity={0.5}
          color="#f0abfc"
          scale={[26, 14, 150]}
          position={[0, 1, -60]}
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
        position={[at('contact')[0], at('contact')[1] + 2.6, at('contact')[2] - 3]}
      />
    </>
  )
}
