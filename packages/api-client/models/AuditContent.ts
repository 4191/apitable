/**
 * Api Document
 * Backend_Server Api Document
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Control } from '../models/Control';
import { Node } from '../models/Node';
import { Space } from '../models/Space';
import { Template } from '../models/Template';
import { Unit } from '../models/Unit';
import { HttpFile } from '../http/http';

/**
* Audit Content
*/
export class AuditContent {
    'space'?: Space;
    /**
    * unit infos
    */
    'units'?: Array<Unit>;
    'control'?: Control;
    'node'?: Node;
    'template'?: Template;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "space",
            "baseName": "space",
            "type": "Space",
            "format": ""
        },
        {
            "name": "units",
            "baseName": "units",
            "type": "Array<Unit>",
            "format": ""
        },
        {
            "name": "control",
            "baseName": "control",
            "type": "Control",
            "format": ""
        },
        {
            "name": "node",
            "baseName": "node",
            "type": "Node",
            "format": ""
        },
        {
            "name": "template",
            "baseName": "template",
            "type": "Template",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return AuditContent.attributeTypeMap;
    }

    public constructor() {
    }
}

