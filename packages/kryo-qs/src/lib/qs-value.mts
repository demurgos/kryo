export type QsPrimitive = undefined | string;

export type QsValue = QsPrimitive | { [P: string]: QsValue } | QsValue[];
