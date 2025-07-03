import { builder } from "@builder.io/react";
import { customComponents } from "../../builder-registry";

// Initialize Builder.io
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// Register custom components for Builder.io Fusion
customComponents.forEach((component) => {
  builder.component(component.component, component);
});
