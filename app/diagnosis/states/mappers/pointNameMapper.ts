import { CephaloPointStep } from "../../cephaloStep";
import { PointName } from "../../model/enum";

const pointNameMapper: Record<PointName, CephaloPointStep> = {
    [PointName.Distance]: CephaloPointStep.Distance,
    [PointName.Pr]: CephaloPointStep.SetPrPoint,
    [PointName.Or]: CephaloPointStep.SetOrPoint,
    [PointName.S]: CephaloPointStep.SetSPoint,
    [PointName.N]: CephaloPointStep.SetNPoint,
    [PointName.PNS]: CephaloPointStep.SetPNSPoint,
    [PointName.ANS]: CephaloPointStep.SetANSPoint,
    [PointName.A]: CephaloPointStep.SetAPoint,
    [PointName.A1]: CephaloPointStep.SetA1Point,
    [PointName.Ar]: CephaloPointStep.SetArPoint,
    [PointName.B1]: CephaloPointStep.SetB1Point,
    [PointName.Br]: CephaloPointStep.SetBrPoint,
    [PointName.Mp]: CephaloPointStep.SetMpPoint,
    [PointName.pMp]: CephaloPointStep.SetpMpPoint,
    [PointName.B]: CephaloPointStep.SetBPoint,
    [PointName.Po]: CephaloPointStep.SetPoPoint,
    [PointName.MeToIr]: CephaloPointStep.SetMeToIrLine,
    [PointName.P1]: CephaloPointStep.SetP1Point,
    [PointName.P2]: CephaloPointStep.SetP2Point,
    [PointName.Ba]: CephaloPointStep.SetBaPoint,
    [PointName.EN]: CephaloPointStep.SetENPoint,
    [PointName.UL]: CephaloPointStep.SetULPoint,
    [PointName.LL]: CephaloPointStep.SetLLPoint,
    [PointName.Dt]: CephaloPointStep.SetDtPoint,
    [PointName.D]: CephaloPointStep.SetDPoint,
    [PointName.PoC]: CephaloPointStep.SetPoCLine,
}

export function mapEnum(source: PointName): CephaloPointStep {
    return pointNameMapper[source];
  }