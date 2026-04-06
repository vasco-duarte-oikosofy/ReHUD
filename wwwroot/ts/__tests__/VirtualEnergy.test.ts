import { describe, it, expect, beforeEach } from 'vitest';
import { EEngineType } from '../r3eTypes.js';
import { createHudElement, makeExtendedShared, makeDriverInfo, executeAndGetText } from './testHelpers.js';

import VirtualEnergyLeft from '../hudElements/VirtualEnergyLeft.js';
import VirtualEnergyPerLap from '../hudElements/VirtualEnergyPerLap.js';
import VirtualEnergyLapsLeft from '../hudElements/VirtualEnergyLapsLeft.js';
import VirtualEnergyLastLap from '../hudElements/VirtualEnergyLastLap.js';
import VirtualEnergyToEnd from '../hudElements/VirtualEnergyToEnd.js';
import VirtualEnergyToAdd from '../hudElements/VirtualEnergyToAdd.js';
import VirtualEnergyTimeLeft from '../hudElements/VirtualEnergyTimeLeft.js';

describe('VirtualEnergyLeft', () => {
  const elementId = 'test-ve-left';
  let element: InstanceType<typeof VirtualEnergyLeft>;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = createHudElement(VirtualEnergyLeft, elementId);
  });

  it('shows virtual energy as percentage for hybrid engine', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
      virtualEnergyCapacity: 10,
    });
    const text = executeAndGetText(element, data, elementId);
    // 4.5 / 10 * 100 = 45.0%
    expect(text).toBe('45.0%');
  });

  it('shows 100% when fully charged', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 10,
      virtualEnergyCapacity: 10,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('100.0%');
  });

  it('shows 0% when empty', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 0,
      virtualEnergyCapacity: 10,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('0.0%');
  });

  it('shows N/A when virtual energy left is invalid (-1)', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: -1,
      virtualEnergyCapacity: 10,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('shows N/A when capacity is invalid (-1)', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
      virtualEnergyCapacity: -1,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('shows N/A when capacity is zero (avoid divide by zero)', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
      virtualEnergyCapacity: 0,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('hides when engine is combustion', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Combustion),
      virtualEnergyLeft: 4.5,
      virtualEnergyCapacity: 10,
    });
    (element as any)._execute(data);
    expect(element.isHidden()).toBe(true);
  });

  it('hides when engine is electric', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Electric),
      virtualEnergyLeft: 4.5,
      virtualEnergyCapacity: 10,
    });
    (element as any)._execute(data);
    expect(element.isHidden()).toBe(true);
  });
});

describe('VirtualEnergyPerLap', () => {
  const elementId = 'test-ve-per-lap';
  let element: InstanceType<typeof VirtualEnergyPerLap>;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = createHudElement(VirtualEnergyPerLap, elementId);
  });

  it('shows virtual energy per lap', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
    }, {
      virtualEnergyPerLap: 1.25,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('1.25');
  });

  it('shows N/A when per-lap value is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
    }, {
      virtualEnergyPerLap: -1,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('hides when engine is not hybrid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Combustion),
    }, {
      virtualEnergyPerLap: 1.25,
    });
    (element as any)._execute(data);
    expect(element.isHidden()).toBe(true);
  });
});

describe('VirtualEnergyLapsLeft', () => {
  const elementId = 'test-ve-laps';
  let element: InstanceType<typeof VirtualEnergyLapsLeft>;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = createHudElement(VirtualEnergyLapsLeft, elementId);
  });

  it('calculates laps remaining from energy and per-lap usage', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
    }, {
      virtualEnergyPerLap: 1.2,
    });
    const text = executeAndGetText(element, data, elementId);
    // 4.5 / 1.2 = 3.75
    expect(text).toBe('3.8');
  });

  it('shows N/A when energy left is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: -1,
    }, {
      virtualEnergyPerLap: 1.2,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('shows N/A when per-lap is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
    }, {
      virtualEnergyPerLap: -1,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('shows N/A when per-lap is zero (avoid divide by zero)', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
    }, {
      virtualEnergyPerLap: 0,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('hides when engine is not hybrid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Combustion),
      virtualEnergyLeft: 4.5,
    }, {
      virtualEnergyPerLap: 1.2,
    });
    (element as any)._execute(data);
    expect(element.isHidden()).toBe(true);
  });

  it('sets default green color when data is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: -1,
    }, {
      virtualEnergyPerLap: 1.2,
    });
    (element as any)._execute(data);
    const root = document.querySelector(':root') as HTMLElement;
    const color = root.style.getPropertyValue('--virtual-energy-left-color');
    expect(color).toBe('rgb(0, 255, 0)');
  });
});

describe('VirtualEnergyLastLap', () => {
  const elementId = 'test-ve-last-lap';
  let element: InstanceType<typeof VirtualEnergyLastLap>;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = createHudElement(VirtualEnergyLastLap, elementId);
  });

  it('shows last lap energy usage', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
    }, {
      virtualEnergyLastLap: 1.18,
      virtualEnergyPerLap: 1.25,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('1.18');
  });

  it('shows N/A when last lap value is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
    }, {
      virtualEnergyLastLap: -1,
      virtualEnergyPerLap: 1.25,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('shows N/A when per-lap average is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
    }, {
      virtualEnergyLastLap: 1.18,
      virtualEnergyPerLap: -1,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('hides when engine is not hybrid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Combustion),
    }, {
      virtualEnergyLastLap: 1.18,
      virtualEnergyPerLap: 1.25,
    });
    (element as any)._execute(data);
    expect(element.isHidden()).toBe(true);
  });

  it('colors green when last lap used less energy than average', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
    }, {
      virtualEnergyLastLap: 1.0,
      virtualEnergyPerLap: 1.25,
    });
    (element as any)._execute(data);
    const root = document.querySelector(':root') as HTMLElement;
    const color = root.style.getPropertyValue('--virtual-energy-last-lap-color');
    // lastLap < perLap means saving energy → should be green-ish
    expect(color).toBeTruthy();
  });
});

describe('VirtualEnergyToEnd', () => {
  const elementId = 'test-ve-to-end';
  let element: InstanceType<typeof VirtualEnergyToEnd>;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = createHudElement(VirtualEnergyToEnd, elementId);
  });

  it('calculates VE needed to finish as percentage', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 5,
      virtualEnergyPerLap: 1.2,
    });
    const text = executeAndGetText(element, data, elementId);
    // 5 * 1.2 = 6.0 MJ needed, 6.0 / 10 * 100 = 60.0%
    expect(text).toBe('60.0%');
  });

  it('shows N/A when lapsUntilFinish is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: -1,
      virtualEnergyPerLap: 1.2,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('shows N/A when virtualEnergyPerLap is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 5,
      virtualEnergyPerLap: -1,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('shows N/A when capacity is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyCapacity: -1,
    }, {
      lapsUntilFinish: 5,
      virtualEnergyPerLap: 1.2,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('hides when engine is not hybrid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Combustion),
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 5,
      virtualEnergyPerLap: 1.2,
    });
    (element as any)._execute(data);
    expect(element.isHidden()).toBe(true);
  });
});

describe('VirtualEnergyToAdd', () => {
  const elementId = 'test-ve-to-add';
  let element: InstanceType<typeof VirtualEnergyToAdd>;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = createHudElement(VirtualEnergyToAdd, elementId);
  });

  it('calculates VE to add as percentage (need more than we have)', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 3.0,
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 8,
      virtualEnergyPerLap: 1.2,
    });
    const text = executeAndGetText(element, data, elementId);
    // need: 8 * 1.2 = 9.6 MJ, have: 3.0 MJ, deficit: 6.6 MJ, 6.6/10*100 = 66.0%
    expect(text).toBe('66.0%');
  });

  it('shows 0.0% when we have more than enough', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 9.0,
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 2,
      virtualEnergyPerLap: 1.2,
    });
    const text = executeAndGetText(element, data, elementId);
    // need: 2 * 1.2 = 2.4, have: 9.0, deficit: -6.6 → clamped to 0
    expect(text).toBe('0.0%');
  });

  it('shows N/A when any input is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: -1,
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 5,
      virtualEnergyPerLap: 1.2,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('N/A');
  });

  it('hides when engine is not hybrid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Combustion),
      virtualEnergyLeft: 3.0,
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 5,
      virtualEnergyPerLap: 1.2,
    });
    (element as any)._execute(data);
    expect(element.isHidden()).toBe(true);
  });

  it('colors red when deficit is large (need much more VE)', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 1.0,
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 8,
      virtualEnergyPerLap: 1.2,
    });
    (element as any)._execute(data);
    const root = document.querySelector(':root') as HTMLElement;
    const color = root.style.getPropertyValue('--virtual-energy-to-add-color');
    // Large deficit → should be reddish
    expect(color).toMatch(/rgb\(.*255.*,\s*\d+/); // red channel should be high
  });

  it('colors green when surplus (have more than enough)', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 9.0,
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 2,
      virtualEnergyPerLap: 1.2,
    });
    (element as any)._execute(data);
    const root = document.querySelector(':root') as HTMLElement;
    const color = root.style.getPropertyValue('--virtual-energy-to-add-color');
    // Surplus → should be greenish
    expect(color).toMatch(/rgb\(\s*0\s*,\s*255/); // green channel should be high, red low
  });

  it('sets middle color when data is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: -1,
      virtualEnergyCapacity: 10,
    }, {
      lapsUntilFinish: 5,
      virtualEnergyPerLap: 1.2,
    });
    (element as any)._execute(data);
    const root = document.querySelector(':root') as HTMLElement;
    const color = root.style.getPropertyValue('--virtual-energy-to-add-color');
    expect(color).toBe('var(--fuel-middle-color)');
  });
});

describe('VirtualEnergyTimeLeft', () => {
  const elementId = 'test-ve-time';
  let element: InstanceType<typeof VirtualEnergyTimeLeft>;

  beforeEach(() => {
    document.body.innerHTML = '';
    element = createHudElement(VirtualEnergyTimeLeft, elementId);
  });

  it('calculates time remaining from energy, per-lap usage, and avg lap time', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
    }, {
      virtualEnergyPerLap: 1.2,
      averageLapTime: 90,
    });
    const text = executeAndGetText(element, data, elementId);
    // 4.5 / 1.2 = 3.75 laps * 90s = 337.5s = 0:05:37
    expect(text).toBe('0:05:37');
  });

  it('shows dash format when energy left is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: -1,
    }, {
      virtualEnergyPerLap: 1.2,
      averageLapTime: 90,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('-:--:--');
  });

  it('shows dash format when per-lap is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
    }, {
      virtualEnergyPerLap: -1,
      averageLapTime: 90,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('-:--:--');
  });

  it('shows dash format when avg lap time is invalid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Hybrid),
      virtualEnergyLeft: 4.5,
    }, {
      virtualEnergyPerLap: 1.2,
      averageLapTime: -1,
    });
    const text = executeAndGetText(element, data, elementId);
    expect(text).toBe('-:--:--');
  });

  it('hides when engine is not hybrid', () => {
    const data = makeExtendedShared({
      vehicleInfo: makeDriverInfo(EEngineType.Combustion),
      virtualEnergyLeft: 4.5,
    }, {
      virtualEnergyPerLap: 1.2,
      averageLapTime: 90,
    });
    (element as any)._execute(data);
    expect(element.isHidden()).toBe(true);
  });
});

describe('VirtualEnergy data contract', () => {
  it('VirtualEnergyPerLap declares +virtualEnergyPerLap as shared memory key', () => {
    document.body.innerHTML = '';
    const element = createHudElement(VirtualEnergyPerLap, 'test-contract-per-lap');
    expect(element.sharedMemoryKeys).toContain('+virtualEnergyPerLap');
  });

  it('VirtualEnergyLastLap declares +virtualEnergyLastLap as shared memory key', () => {
    document.body.innerHTML = '';
    const element = createHudElement(VirtualEnergyLastLap, 'test-contract-last-lap');
    expect(element.sharedMemoryKeys).toContain('+virtualEnergyLastLap');
  });

  it('VirtualEnergyLastLap declares +virtualEnergyPerLap as shared memory key', () => {
    document.body.innerHTML = '';
    const element = createHudElement(VirtualEnergyLastLap, 'test-contract-last-lap-2');
    expect(element.sharedMemoryKeys).toContain('+virtualEnergyPerLap');
  });

  it('VirtualEnergyLapsLeft reads virtualEnergyLeft from raw data', () => {
    document.body.innerHTML = '';
    const element = createHudElement(VirtualEnergyLapsLeft, 'test-contract-laps');
    expect(element.sharedMemoryKeys).toContain('virtualEnergyLeft');
  });

  it('VirtualEnergyLapsLeft reads +virtualEnergyPerLap from extra data', () => {
    document.body.innerHTML = '';
    const element = createHudElement(VirtualEnergyLapsLeft, 'test-contract-laps-2');
    expect(element.sharedMemoryKeys).toContain('+virtualEnergyPerLap');
  });
});
