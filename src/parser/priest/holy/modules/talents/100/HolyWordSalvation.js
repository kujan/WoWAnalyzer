import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import TalentStatisticBox, { STATISTIC_ORDER } from 'interface/others/TalentStatisticBox';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import SpellIcon from 'common/SpellIcon';
import React from 'react';
import Renew from 'parser/priest/holy/modules/spells/Renew';
import PrayerOfMending from 'parser/priest/holy/modules/spells/PrayerOfMending';
import ItemHealingDone from 'interface/others/ItemHealingDone';
import { formatThousands } from 'common/format';

// Example Log: /report/PNYB4zgrnR86h7Lc/6-Normal+Zek'voz,+Herald+of+N'zoth/Khadaj
class HolyWordSalvation extends Analyzer {
  salvTicks = 0;
  healingFromSalv = 0;
  overhealingFromSalv = 0;

  static dependencies = {
    renew: Renew,
    prayerOfMending: PrayerOfMending,
  };

  get renewCount() {
    return this.renew.renewsFromSalv;
  }

  get healingFromRenew() {
    return this.renew.healingFromRenew(this.renewCount);
  }

  get pomCount() {
    return this.prayerOfMending.pomTicksFromSalv;
  }

  get healingFromPom() {
    return this.prayerOfMending.averagePomTickHeal * this.pomCount;
  }

  get totalHealing() {
    return this.healingFromSalv + this.healingFromRenew + this.healingFromPom;
  }

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.HOLY_WORD_SALVATION_TALENT.id);
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;

    if (spellId === SPELLS.HOLY_WORD_SALVATION_TALENT.id) {
      this.healingFromSalv += event.amount | 0;
      this.overhealingFromSalv += event.overhealing | 0;
      this.salvTicks += 1;
    }
  }

  statistic() {
    return (

      <TalentStatisticBox
        category={STATISTIC_CATEGORY.TALENTS}
        icon={<SpellIcon id={SPELLS.HOLY_WORD_SALVATION_TALENT.id} />}
        value={(
          <ItemHealingDone amount={this.totalHealing} />
        )}
        label="Holy Word: Salvation"
        tooltip={`
          Healing from Salv: ${formatThousands(this.healingFromSalv)}<br />
          Healing from Renews: ${formatThousands(this.healingFromRenew)}<br />
          Healing from PoMs: ${formatThousands(this.healingFromPom)}
        `}
        position={STATISTIC_ORDER.CORE(7)}
      />

    );
  }
}

export default HolyWordSalvation;
