import HudElement, {Hide} from "./HudElement.js";
import {valuesAreValid, timeFormat} from "../consts.js";
import {EEngineType, IDriverInfo} from '../r3eTypes.js';
import {SharedMemoryKey} from '../SharedMemoryConsumer.js';

export default class VirtualEnergyTimeLeft extends HudElement {
  override sharedMemoryKeys: SharedMemoryKey[] = ['vehicleInfo', 'virtualEnergyLeft', '+virtualEnergyPerLap', '+averageLapTime'];

  protected override render(vehicleInfo: IDriverInfo, virtualEnergyLeft: number, virtualEnergyPerLap: number, averageLapTime: number): string | Hide {
    if (vehicleInfo.engineType !== EEngineType.Hybrid) {
      return this.hide(timeFormat(null));
    }
    if (!valuesAreValid(virtualEnergyLeft, virtualEnergyPerLap, averageLapTime)) {
      return timeFormat(null);
    }
    const time = virtualEnergyLeft / virtualEnergyPerLap * averageLapTime;
    return timeFormat(time);
  }
}
