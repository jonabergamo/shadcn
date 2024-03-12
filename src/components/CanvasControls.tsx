"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaSquare,
  FaSlash,
  FaDownload,
  FaTextWidth,
  FaArrowRight,
} from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { LuRectangleHorizontal, LuImagePlus } from "react-icons/lu";
import { FcAddImage } from "react-icons/fc";
import { SketchPicker, ColorResult, Color } from "react-color";

interface CanvasControlsProps {
  handleAddRectangle?: () => void;
  handleAddLine?: () => void;
  handleDownload?: () => void;
  handleAddText?: () => void;
  handleAddArrow?: () => void;
  handleAddImage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeColor?: (color: string) => void;
  onWidthChange?: (width: number) => void;
}

export default function CanvasControls({
  handleAddRectangle,
  handleAddLine,
  handleDownload,
  handleAddText,
  handleAddArrow,
  handleAddImage,
  onChangeColor,
  onWidthChange,
}: CanvasControlsProps) {
  const [color, setColor] = useState("#FF0000");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(5); // Valor inicial

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(event.target.value, 10);
    setWidth(newWidth);
    if (!onWidthChange) return;
    onWidthChange(newWidth);
  };

  const handleChangeComplete = useCallback(
    (color: ColorResult) => {
      setColor(color.hex);
      if (onChangeColor) {
        onChangeColor(color.hex);
      }
    },
    [onChangeColor]
  );

  const handleDocumentClick = useCallback((e: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      setShowPicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [handleDocumentClick]);

  return (
    <div className="w-full flex items-center justify-start p-2 h-14 border-[0.5px] border-slate-300 rounded-xl">
      <label className="cursor-pointer p-2 rounded hover:bg-slate-300 h-full">
        <MdAddPhotoAlternate
          className="text-2xl text-slate-700  "
          title="Adicionar Imagem"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          className="hidden"
        />
      </label>
      <button
        onClick={handleAddRectangle}
        className="p-2 rounded hover:bg-slate-300 h-full">
        <LuRectangleHorizontal
          className="text-2xl text-slate-700"
          title="Adicionar Retângulo"
        />
      </button>
      <button
        onClick={handleAddLine}
        className="p-2 rounded hover:bg-slate-300">
        <FaSlash className="text-2xl text-slate-700" title="Adicionar Linha" />
      </button>
      <button
        onClick={handleDownload}
        className="p-2 rounded hover:bg-slate-300">
        <FaDownload className="text-2xl text-slate-700" title="Baixar" />
      </button>
      <button
        onClick={handleAddText}
        className="p-2 rounded hover:bg-slate-300">
        <FaTextWidth
          className="text-2xl text-slate-700"
          title="Adicionar Texto"
        />
      </button>
      <button
        onClick={handleAddArrow}
        className="p-2 rounded hover:bg-slate-300">
        <FaArrowRight
          className="text-2xl text-slate-700"
          title="Adicionar Seta"
        />
      </button>
      <div
        className="relative p-2 hover:bg-slate-300 rounded"
        title="Mudar Cor">
        <div
          className=" w-6 h-6 rounded-full cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setShowPicker((show) => !show)}
        />

        {showPicker && (
          <div className="z-10 absolute " ref={pickerRef}>
            <SketchPicker
              color={color}
              onChangeComplete={handleChangeComplete}
            />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <label
          htmlFor="width-slider"
          className="text-sm text-gray-700 font-medium">
          Largura:
        </label>
        <input
          id="width-slider"
          type="range"
          min="1" // Mínimo valor
          max="20" // Máximo valor
          value={width}
          onChange={handleWidthChange}
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
        />
        <span className="text-sm text-gray-700">{width}px</span>
        <div className={`bg-black h-6`} style={{ width: width + "px" }}></div>
      </div>
    </div>
  );
}
