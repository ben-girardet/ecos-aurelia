export declare const EcosEmptyComponent: import("@aurelia/kernel").ResourceType<import("aurelia").Constructable<{}>, import("aurelia").ICustomElementViewModel, import("@aurelia/kernel").PartialResourceDefinition<{
    readonly cache?: number | "*";
    readonly template?: string | Node;
    readonly instructions?: readonly (readonly import("@aurelia/runtime-html").IInstruction[])[];
    readonly dependencies?: readonly import("aurelia").Key[];
    readonly injectable?: import("@aurelia/runtime-html/dist/resources/custom-element").InjectableToken<any>;
    readonly needsCompile?: boolean;
    readonly surrogates?: readonly import("@aurelia/runtime-html").IInstruction[];
    readonly bindables?: readonly string[] | Record<string, import("aurelia").PartialBindableDefinition>;
    readonly childrenObservers?: Record<string, import("@aurelia/runtime-html").PartialChildrenDefinition>;
    readonly containerless?: boolean;
    readonly isStrictBinding?: boolean;
    readonly shadowOptions?: {
        mode: "open" | "closed";
    };
    readonly hasSlots?: boolean;
    readonly enhance?: boolean;
    readonly projectionsMap?: Map<import("@aurelia/runtime-html").IInstruction, Record<string, import("@aurelia/runtime-html").CustomElementDefinition<import("aurelia").Constructable<{}>>>>;
    readonly watches?: import("@aurelia/runtime-html").IWatchDefinition<object>[];
    readonly processContent?: (node: import("aurelia").INode<Node>, platform: import("aurelia").IPlatform) => boolean | void;
}>, {}>;
