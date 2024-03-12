"use client";
import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { v1 as uuid } from "uuid";

export default function Canvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  let canvas;
  const [drawingMode, setDrawingMode] = useState(false);

  useEffect(() => {
    // Inicializar o canvas usando o useRef
    canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
    });

    // Configurar algumas propriedades do canvas
    canvas.selection = false;

    // Adicionar o canvas como um objeto global para facilitar o acesso
    window.canvas = canvas;

    return () => {
      // Limpar o canvas ao desmontar o componente para evitar vazamentos de memória
      canvas.dispose();
    };
  }, []); // Executar isso apenas uma vez na montagem do componente

  const handleAddRectangle = () => {
    // Criar um retângulo no centro do canvas
    const rect = new fabric.Rect({
      left: canvas.width / 2 - 50,
      top: canvas.height / 2 - 50,
      width: 100,
      height: 50,
      fill: "transparent",
      stroke: "red",
      strokeWidth: 3,
      selectable: true,
    });

    // Adicionar o retângulo ao canvas
    canvas.add(rect);
  };

  useEffect(() => {
    // Configurar o ouvinte de teclado para excluir objetos selecionados
    const handleKeyPress = (event) => {
      if (event.code === "Delete") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    // Adicionar o ouvinte de teclado
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      // Remover o ouvinte de teclado ao desmontar o componente
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [canvas]);

  const handleAddLine = () => {
    // Criar uma linha no centro do canvas
    const line = new fabric.Line([50, 50, 150, 50], {
      stroke: "red",
      strokeWidth: 3,
      selectable: true,
      angle: 90,
    });

    // Adicionar a linha ao canvas
    canvas.add(line);
  };

  const handleDownload = () => {
    const fabricImage = canvas.backgroundImage;

    // Verificar se há uma imagem de fundo no canvas
    if (fabricImage) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "whiteboard.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          const canvasWidth = 900;
          const canvasHeight = img.height * (canvasWidth / img.width);

          // Ajustar diretamente as dimensões da imagem para o tamanho do canvas
          const fabricImage = new fabric.Image(img, {
            left: 0,
            top: 0,
            scaleY: canvasHeight / img.height,
            scaleX: canvasWidth / img.width,
          });

          // Definir o tamanho do canvas igual ao da imagem
          canvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
          });

          canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    const defaultText = "Digite aqui";

    // Criar um objeto de texto no centro do canvas
    const text = new fabric.Text(defaultText, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontSize: 24,
      fill: "black",
      selectable: true,
      backgroundColor: "white",
    });

    // Adicionar o texto ao canvas
    canvas.add(text);
  };
  const handleAddArrow = () => {
    const arrow = new fabric.Group(
      [
        // Linha principal da seta
        new fabric.Line([0, 0, 100, 0], {
          stroke: "red",
          strokeWidth: 2,
          selectable: true,
        }),

        // Cabeça da seta (triângulo)
        new fabric.Triangle({
          width: 20,
          height: 30,
          fill: "red",
          left: 130,
          top: -9,
          selectable: true,
          angle: 90,
        }),
      ],
      {
        left: canvas.width / 2 - 50,
        top: canvas.height / 2 - 15,
        angle: 90,
        selectable: true,
      }
    );

    // Adicionar a seta ao canvas
    canvas.add(arrow);
  };

  return (
    <div className="w-full h-full">
      <button onClick={handleAddRectangle}>Adicionar Retângulo</button>
      <button onClick={handleAddLine}>Adicionar Linha</button>
      <button onClick={handleDownload}>Baixar</button>
      <button onClick={handleAddText}>Adicionar Texto</button>
      <button onClick={handleAddArrow}>Adicionar Seta</button>

      <button onClick={() => canvas.setZoom(canvas.getZoom() * 1.1)}>
        Zoom In
      </button>
      <button onClick={() => canvas.setZoom(canvas.getZoom() / 1.1)}>
        Zoom Out
      </button>
      <input type="file" accept="image/*" onChange={handleAddImage} />
      <div
        className="max-h-[400px] max-w-[900px] overflow-scroll"
        ref={containerRef}>
        <canvas ref={canvasRef} width={900} height={600} />
      </div>
    </div>
  );
}
