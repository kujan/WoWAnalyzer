import CoreCombatLogParser from 'parser/core/CombatLogParser';
import HealingDone from 'parser/core/modules/HealingDone';
import DamageDone from 'parser/core/modules/DamageDone';
import DamageTaken from 'parser/core/modules/DamageTaken';

import Abilities from './modules/Abilities';
import AlwaysBeCasting from './modules/features/AlwaysBeCasting';
import SpellUsable from './modules/features/SpellUsable';
import Checklist from './modules/features/Checklist/Module';
import MitigationCheck from './modules/features/MitigationCheck';


//Spells
import Judgment from './modules/spells/Judgment';
import LightOfTheProtectorTiming from './modules/features/LightOfTheProtectorTiming';
import ShieldOfTheRighteous from './modules/features/ShieldOfTheRighteous';
import Consecration from './modules/features/Consecration';

//Talents
import Seraphim from './modules/talents/Seraphim';
import RighteousProtector from './modules/talents/RighteousProtector';

//import CooldownTracker from './Modules/Features/CooldownTracker';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    // Core Statistics
    damageTaken: [DamageTaken, { showStatistic: true }],
    damageDone: [DamageDone, { showStatistic: true }],
    healingDone: [HealingDone, { showStatistic: true }],

    // Paladin Core

    // Features
    abilities: Abilities,
    alwaysBeCasting: AlwaysBeCasting,
    spellUsable: SpellUsable,
    checklist: Checklist,
    lightOfTheProtectorTiming: LightOfTheProtectorTiming,
    shieldOfTheRighteous: ShieldOfTheRighteous,
    consecration: Consecration,
    mitigationcheck: MitigationCheck,
    //cooldownTracker: CooldownTracker,

    // Talents
    righteousProtector: RighteousProtector,
    judgment: Judgment,
    seraphim: Seraphim,
  };
}

export default CombatLogParser;
