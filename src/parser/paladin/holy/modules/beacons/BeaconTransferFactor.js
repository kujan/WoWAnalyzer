import Analyzer from 'parser/core/Analyzer';
import Combatants from 'parser/core/modules/Combatants';

import BeaconTargets from './BeaconTargets';
import { BEACON_TRANSFERING_ABILITIES, BEACON_TYPES } from '../../constants';

class BeaconTransferFactor extends Analyzer {
  static dependencies = {
    combatants: Combatants,
    beaconTargets: BeaconTargets,
    // This also relies on the BeaconOfVirtueNormalizer so precasting FoL into BoV is accounted for properly.
  };

  get beaconType() {
    return this.selectedCombatant.lv100Talent;
  }

  getFactor(healEvent, beaconHealEvent = null) {
    const spellId = healEvent.ability.guid;
    // base beacon transfer factor
    let beaconFactor = 0.4;
    // Spell specific transfer factor
    const spellFactor = BEACON_TRANSFERING_ABILITIES[spellId];
    if (!spellFactor) {
      return 0;
    }
    beaconFactor *= spellFactor;
    // Passive adjustments
    if (this.beaconType === BEACON_TYPES.BEACON_OF_FATH) {
      beaconFactor *= 0.7;
    }

    return beaconFactor;
  }
  getExpectedTransfer(healEvent) {
    // Beacons work off raw healing
    const rawHealing = healEvent.amount + (healEvent.absorbed || 0) + (healEvent.overheal || 0);
    return Math.round(rawHealing * this.getFactor(healEvent));
  }
}

export default BeaconTransferFactor;
