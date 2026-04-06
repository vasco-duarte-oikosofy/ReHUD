import HudElement, {Hide} from "./HudElement.js";
import {valuesAreValid, NA} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyToEnd extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', 'virtualEnergyCapacity', '+lapsUntilFinish', '+virtualEnergyPerLap'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyCapacity: number, lapsUntilFinish: number, virtualEnergyPerLap: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide('N/A');
    }
    if (!valuesAreValid(lapsUntilFinish, virtualEnergyPerLap, virtualEnergyCapacity) || virtualEnergyCapacity === 0) {
      return NA;
    }
    const needed = lapsUntilFinish * virtualEnergyPerLap;
    const percent = (needed / virtualEnergyCapacity) * 100;
    return `${percent.toFixed(1)}%`;
  }
}
