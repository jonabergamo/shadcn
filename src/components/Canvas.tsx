"use client";
import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: drawingMode,
        backgroundImage: "",
        width: containerRef.current?.clientWidth,
      });
      fabricCanvasRef.current.selection = false;

      // Acessível globalmente para facilitar a depuração
      (window as any).canvas = fabricCanvasRef.current;

      const handleMouseDown = (opt: fabric.IEvent) => {
        const evt = opt.e as MouseEvent;
        if (evt.altKey) {
          (fabricCanvasRef.current as any).isDragging = true;
          fabricCanvasRef.current!.selection = false;
          (fabricCanvasRef.current as any).lastPosX = evt.clientX;
          (fabricCanvasRef.current as any).lastPosY = evt.clientY;
        }
      };

      const handleMouseMove = (opt: fabric.IEvent) => {
        if ((fabricCanvasRef.current as any).isDragging) {
          const e = opt.e as MouseEvent;
          const vpt = fabricCanvasRef.current!.viewportTransform!;
          vpt[4] += e.clientX - (fabricCanvasRef.current as any).lastPosX;
          vpt[5] += e.clientY - (fabricCanvasRef.current as any).lastPosY;
          fabricCanvasRef.current!.requestRenderAll();
          (fabricCanvasRef.current as any).lastPosX = e.clientX;
          (fabricCanvasRef.current as any).lastPosY = e.clientY;
        }
      };

      const handleMouseUp = () => {
        fabricCanvasRef.current!.setViewportTransform(
          fabricCanvasRef.current!.viewportTransform!
        );
        (fabricCanvasRef.current as any).isDragging = false;
        fabricCanvasRef.current!.selection = true;
      };

      fabricCanvasRef.current.on("mouse:down", handleMouseDown);
      fabricCanvasRef.current.on("mouse:move", handleMouseMove);
      fabricCanvasRef.current.on("mouse:up", handleMouseUp);
      fabricCanvasRef.current.on("mouse:wheel", function (opt) {
        const e = opt.e as WheelEvent;
        let zoom = fabricCanvasRef.current!.getZoom();
        zoom *= 0.999 ** e.deltaY;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        fabricCanvasRef.current!.zoomToPoint(
          { x: e.offsetX, y: e.offsetY },
          zoom
        );
        e.preventDefault();
        e.stopPropagation();
      });
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off("mouse:down");
        fabricCanvasRef.current.off("mouse:move");
        fabricCanvasRef.current.off("mouse:up");
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [drawingMode]);

  // Adiciona um retângulo ao canvas
  const handleAddRectangle = () => {
    if (fabricCanvasRef.current) {
      const rect = new fabric.Rect({
        left: fabricCanvasRef.current.width! / 2 - 50,
        top: fabricCanvasRef.current.height! / 2 - 50,
        width: 100,
        height: 50,
        fill: "transparent",
        stroke: "red",
        strokeWidth: 3,
        selectable: true,
        lockUniScaling: true,
      });
      fabricCanvasRef.current.add(rect);
    }
  };

  // Listener para tecla Delete, para excluir objeto selecionado
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Delete" && fabricCanvasRef.current) {
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (activeObject) {
          fabricCanvasRef.current.remove(activeObject);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Adiciona uma linha ao canvas
  const handleAddLine = () => {
    if (fabricCanvasRef.current) {
      const line = new fabric.Line([50, 100, 200, 100], {
        stroke: "red",
        strokeWidth: 2,
        selectable: true,
        left: fabricCanvasRef.current.width! / 2,
        top: fabricCanvasRef.current.width! / 2,
        angle: 90,
      });
      fabricCanvasRef.current.add(line);
    }
  };

  // Função para adicionar texto
  const handleAddText = () => {
    if (fabricCanvasRef.current) {
      const text = new fabric.Textbox("Digite aqui", {
        left: fabricCanvasRef.current.width! / 2,
        top: fabricCanvasRef.current.height! / 2,
        fontSize: 24,
        fill: "#000",
        selectable: true,
        backgroundColor: "white",
      });
      fabricCanvasRef.current.add(text);
    }
  };

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        const imgElement = new Image();
        imgElement.src = e.target!.result as string;
        imgElement.onload = function () {
          // Ajustando a imagem para o tamanho do canvas
          const canvasWidth = fabricCanvasRef.current?.width!;
          const canvasHeight =
            imgElement.height * (canvasWidth / imgElement.width);
          const fabricImage = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
            scaleX: canvasWidth / imgElement.width,
            scaleY: canvasHeight / imgElement.height,
          });

          // Definindo o tamanho do canvas para combinar com a imagem carregada
          fabricCanvasRef.current!.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
          });

          fabricCanvasRef.current!.setBackgroundImage(
            fabricImage,
            fabricCanvasRef.current!.renderAll.bind(fabricCanvasRef.current)
          );
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddArrow = () => {
    if (fabricCanvasRef.current) {
      const arrow = new fabric.Group(
        [
          // Linha principal da seta
          new fabric.Line([0, 0, 50, 0], {
            stroke: "red",
            strokeWidth: 2,
            selectable: true,
            originX: "center",
            originY: "center",
          }),
          // Cabeça da seta (triângulo)
          new fabric.Triangle({
            width: 10,
            height: 15,
            fill: "red",
            left: 50, // Ajuste para que a cabeça da seta esteja diretamente conectada à linha
            top: 0, // Ajuste para alinhar verticalmente o centro do triângulo com a linha
            angle: 90,
            originX: "center",
            originY: "center",
            selectable: true,
          }),
        ],
        {
          left: fabricCanvasRef.current.width! / 2 - 50,
          top: fabricCanvasRef.current.height! / 2 - 15,
          angle: 90,
          selectable: true,
        }
      );

      // Adicionar a seta ao canvas
      fabricCanvasRef.current.add(arrow);
    }
  };

  const handleDownload = () => {
    if (fabricCanvasRef.current) {
      // Exportar o estado atual do canvas para JSON
      const json = fabricCanvasRef.current.toJSON();

      // Criar um novo canvas temporário para o download
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = fabricCanvasRef.current.getWidth();
      tempCanvas.height = fabricCanvasRef.current.getHeight();
      const tempFabricCanvas = new fabric.Canvas(tempCanvas);

      // Carregar o estado do canvas original no canvas temporário
      tempFabricCanvas.loadFromJSON(json, () => {
        // Ajustes após o carregamento, como redefinir zoom e posição
        tempFabricCanvas.setZoom(1);
        tempFabricCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        tempFabricCanvas.requestRenderAll();

        // Use um timeout para garantir que o canvas seja renderizado antes de exportar
        setTimeout(() => {
          // Exportar a imagem do canvas temporário
          const dataURL = tempFabricCanvas.toDataURL({
            format: "png",
            quality: 1,
          });

          // Proceder com o download
          const link = document.createElement("a");
          link.download = "canvas-image.png";
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Limpar após o download
          tempFabricCanvas.dispose();
        }, 100); // Ajuste este tempo se necessário
      }); // Remova o terceiro argumento incorreto que era um array de strings
    }
  };

  return (
    <div className="w-full h-full">
      <button onClick={handleAddRectangle}>Adicionar Retângulo</button>
      <button onClick={handleAddLine}>Adicionar Linha</button>
      <button onClick={handleDownload}>Baixar</button>
      <button onClick={handleAddText}>Adicionar Texto</button>
      <button onClick={handleAddArrow}>Adicionar Seta</button>

      <input type="file" accept="image/*" onChange={handleAddImage} />
      <div
        className="h-[70vh] max-w-[60vw] overflow-hidden bg-white"
        ref={containerRef}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
