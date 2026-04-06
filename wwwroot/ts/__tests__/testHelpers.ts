import { EEngineType, IDriverInfo } from '../r3eTypes.js';
import HudElement from '../hudElements/HudElement.js';
import { IExtendedShared } from '../consts.js';
import { ITireData } from '../r3eTypes.js';

/**
 * Creates a minimal IDriverInfo with the given engine type.
 */
export function makeDriverInfo(engineType: EEngineType): IDriverInfo {
  return {
    name: '',
    carNumber: 1,
    classId: 1,
    modelId: 1,
    teamId: 1,
    liveryId: 1,
    manufacturerId: 1,
    userId: 1,
    slotId: 1,
    classPerformanceIndex: 1,
    engineType,
    carWidth: 2,
    carLength: 4.5,
  };
}

/**
 * Creates a HUD element instance with minimal required options.
 * Sets up DOM elements so execute() can work.
 */
export function createHudElement<T extends HudElement>(
  Ctor: new (options: any) => T,
  elementId: string,
  containerId?: string
): T {
  // Create DOM elements
  if (containerId && !document.getElementById(containerId)) {
    const container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }
  if (!document.getElementById(elementId)) {
    const el = document.createElement('span');
    el.id = elementId;
    const parent = containerId ? document.getElementById(containerId) : document.body;
    parent!.appendChild(el);
  }

  const instance = new Ctor({
    name: `test-${elementId}`,
    elementId,
    containerId: containerId ?? null,
    transformableId: 'fuel-data', // dummy, just needs to be a valid key
  });

  // Set a mock hud
  (instance as any).hud = {
    isInEditMode: () => false,
    layoutElements: {},
  };

  return instance;
}

const defaultTireData: ITireData<number> = { frontLeft: 0, frontRight: 0, rearLeft: 0, rearRight: 0 };

/**
 * Creates a minimal IExtendedShared with given overrides for rawData and extra fields.
 */
export function makeExtendedShared(
  rawOverrides: Record<string, any> = {},
  extraOverrides: Record<string, any> = {}
): IExtendedShared {
  const rawData = {
    vehicleInfo: makeDriverInfo(EEngineType.Combustion),
    fuelLeft: -1,
    fuelCapacity: -1,
    fuelPerLap: -1,
    batterySoC: -1,
    fuelUseActive: 1,
    ...rawOverrides,
  } as any;

  return {
    rawData,
    lapId: 0,
    lastLapTime: -1,
    allTimeBestLapTime: -1,
    fuelPerLap: -1,
    fuelLastLap: -1,
    tireWearPerLap: defaultTireData,
    tireWearLastLap: defaultTireData,
    averageLapTime: -1,
    bestLapTime: -1,
    sessionBestLapTime: -1,
    estimatedRaceLapCount: -1,
    lapsUntilFinish: -1,
    forceUpdateAll: false,
    timestamp: Date.now(),
    events: [],
    deltasAhead: {},
    deltasBehind: {},
    leaderCrossedSFLineAt0: -1,
    deltaToSessionBestLap: -1,
    deltaToBestLap: -1,
    crossedFinishLine: false,
    currentLaptime: -1,
    virtualEnergyPerLap: -1,
    virtualEnergyLastLap: -1,
    ...extraOverrides,
  };
}

/**
 * Calls the protected render method directly via the public execute path.
 * Returns the text content of the target DOM element after execution.
 */
export function executeAndGetText(element: HudElement, data: IExtendedShared, elementId: string): string {
  // Call _execute (from Action) which calls execute (HudElement's override)
  (element as any)._execute(data);
  return document.getElementById(elementId)?.innerText ?? document.getElementById(elementId)?.textContent ?? '';
}
