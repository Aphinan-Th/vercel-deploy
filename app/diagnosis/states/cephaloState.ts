import { Point } from "../model/type";
import { DiagnosisCephalo } from "./diagnosis";

export abstract class CephaloState {

    constructor(protected diagnosis: DiagnosisCephalo) { }

    abstract click(point: Point): void
    abstract undo(): void
    abstract getStateDescription(): StateDescriptionModel
    abstract executeLine(): void
}

export interface CephaloDictionary {
    [key: string]: CephaloState;
}

export interface StateDescriptionModel {
    pointName: string,
    title: string,
    description: string,
    imagePath: string
}