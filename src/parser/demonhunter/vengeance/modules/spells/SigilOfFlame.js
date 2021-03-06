import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import AbilityTracker from 'parser/core/modules/AbilityTracker';
import Enemies from 'parser/core/modules/Enemies';

import SPELLS from 'common/SPELLS/index';
import SpellIcon from 'common/SpellIcon';

import { formatPercentage, formatThousands, formatDuration } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
/*Purpose of this module is to track the sigil of flame debuff and see when 2 of them overlap for a damage increase.
* This is important for damage and also squeezing extra fire damage during Fiery Brand because of the
* Fiery Demise talent that increases your fire damage during that CD. Also due to trait charred blades that heals
* us for 15% of the fire damage we do it also increases our self healing.*/
class SigilOfFlame extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    enemies: Enemies,
  };

  successfulStack = 0;
  lastApplicationTimestamp = 0;
  currentApplicationTimestamp = 0;

  on_byPlayer_applydebuff(event){
    const spellId = event.ability.guid;
    let timeStampDifference = null;

    if(spellId !== SPELLS.SIGIL_OF_FLAME_DEBUFF.id) {
      return;
    }
    if(this.lastApplicationTimestamp === 0){
      this.lastApplicationTimestamp = event.timestamp;
      return;
    }
      this.currentApplicationTimestamp = event.timestamp;
      timeStampDifference = this.currentApplicationTimestamp - this.lastApplicationTimestamp;

    /*3 sec is the cut off because we want most of the 2 buffs to stack. So if the second
    buff application isnt within 3 seconds of the first its effectiveness is reduced quiet a bit*/
    if((timeStampDifference/1000) < 3 ) {
      this.successfulStack += 1;
    }
    this.lastApplicationTimestamp = this.currentApplicationTimestamp;
  }


  statistic() {
    const sigilOfFlameUptime = this.enemies.getBuffUptime(SPELLS.SIGIL_OF_FLAME_DEBUFF.id);
    const sigilOfFlameUptimePercentage = sigilOfFlameUptime / this.owner.fightDuration;
    const sigilOfFlameDamage = this.abilityTracker.getAbility(SPELLS.SIGIL_OF_FLAME_DEBUFF.id).damageEffective;

    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(5)}
        icon={<SpellIcon id={SPELLS.SIGIL_OF_FLAME_CONCENTRATED.id} />}
        value={`${this.successfulStack} times`}
        label="Sigil of Flame stacked twice"
        tooltip={`Having two stacks of Sigil Of Flames on the boss is a damage increase. This is especially important during Fiery Brand due to the Fiery Demise artifact trait that increases the fire damage you do by 10%. This increases your damage and self healing.</br><br/>
                  Sigil of Flame uptime: ${formatPercentage(sigilOfFlameUptimePercentage)}% / (${formatDuration(sigilOfFlameUptime / 1000)})<br/>
                  Sigil of Flame total damage: ${formatThousands(sigilOfFlameDamage)}.`}
      />
    );
  }
}

export default SigilOfFlame;
