/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { Component, DropZone, BuilderState } from '@/types/builder';

export const useBuilder = () => {
  const [state, setState] = useState<BuilderState>({
    components: [],
    selectedComponent: null,
    dropZones: [{ id: 'root', parentId: null, children: [] }],
  });

  const addComponent = useCallback((component: Component, dropZoneId: string) => {
    setState((prev) => {
      // Generate a unique ID for the new component
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const uniqueId = `${component.id}-${timestamp}-${random}`;

      const newComponent = {
        ...component,
        id: uniqueId,
      };

      const updatedDropZones = prev.dropZones.map((zone) => {
        if (zone.id === dropZoneId) {
          return {
            ...zone,
            children: [...zone.children, newComponent],
          };
        }
        return zone;
      });

      return {
        ...prev,
        components: [...prev.components, newComponent],
        dropZones: updatedDropZones,
      };
    });
  }, []);

  const removeComponent = useCallback((componentId: string) => {
    setState((prev) => {
      const updatedComponents = prev.components.filter(
        (comp) => comp.id !== componentId
      );
      const updatedDropZones = prev.dropZones.map((zone) => ({
        ...zone,
        children: zone.children.filter((comp) => comp.id !== componentId),
      }));

      return {
        ...prev,
        components: updatedComponents,
        dropZones: updatedDropZones,
        selectedComponent:
          prev.selectedComponent?.id === componentId
            ? null
            : prev.selectedComponent,
      };
    });
  }, []);

  const selectComponent = useCallback((component: Component | null) => {
    setState((prev) => ({
      ...prev,
      selectedComponent: component,
    }));
  }, []);

  const reorderComponents = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      const rootZone = prev.dropZones.find((zone) => zone.id === 'root');
      if (!rootZone) return prev;

      const updatedChildren = [...rootZone.children];
      const [movedComponent] = updatedChildren.splice(fromIndex, 1);
      updatedChildren.splice(toIndex, 0, movedComponent);

      const updatedDropZones = prev.dropZones.map((zone) =>
        zone.id === 'root' ? { ...zone, children: updatedChildren } : zone
      );

      return {
        ...prev,
        components: updatedChildren,
        dropZones: updatedDropZones,
      };
    });
  }, []);

  const moveComponent = useCallback((componentId: string, direction: 'up' | 'down') => {
    setState((prev) => {
      const rootZone = prev.dropZones.find((zone) => zone.id === 'root');
      if (!rootZone) return prev;

      const currentIndex = rootZone.children.findIndex(comp => comp.id === componentId);
      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= rootZone.children.length) return prev;

      const updatedChildren = [...rootZone.children];
      const [movedComponent] = updatedChildren.splice(currentIndex, 1);
      updatedChildren.splice(newIndex, 0, movedComponent);

      const updatedDropZones = prev.dropZones.map((zone) =>
        zone.id === 'root' ? { ...zone, children: updatedChildren } : zone
      );

      return {
        ...prev,
        components: updatedChildren,
        dropZones: updatedDropZones,
      };
    });
  }, []);

  const updateComponent = useCallback((componentId: string, updatedProps: Record<string, any>) => {
    setState((prevState) => {
      const updatedDropZones = prevState.dropZones.map((zone) => ({
        ...zone,
        children: zone.children.map((component) =>
          component.id === componentId
            ? { ...component, props: { ...component.props, ...updatedProps } }
            : component
        ),
      }));

      return {
        ...prevState,
        dropZones: updatedDropZones,
      };
    });
  }, []);

  return {
    state,
    addComponent,
    removeComponent,
    selectComponent,
    reorderComponents,
    moveComponent,
    updateComponent,
  };
}; 