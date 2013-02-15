

$(document).ready(function() {

    verifyLogin();

    $.cookie.json = true;
    usuario = $.cookie('usuario');
    $("#nomeVendedor").html(usuario.nome);
    $("#hiddenIdVendedor").val(usuario.id);

    preparaData($("#inputData"));

});


$("#btnModalBuscarCliente").click(function() {
    $("#clienteModal").modal("show");

    if ($("#inputNomeCliente").val().length > 0)
    {
        $("#inputBuscarCliente").val($("#inputNomeCliente").val());
    }
});

$("#btnModalBuscarProduto").click(function() {
    
    $(".itemProduto").parent().removeClass("alert-danger").addClass("alert-success");
    $("#errorProduto").hide();
    
    $("#produtoModal").modal("show");

    if ($("#inputNomeProduto").val().length > 0)
    {
        $("#inputBuscarProduto").val($("#inputNomeProduto").val());
    }
});

$("#inputBuscarCliente").keydown(function(event) {
    if (event.keyCode == 13) {
        buscarCliente();
    }
});

$("#inputBuscarProduto").keydown(function(event) {
    if (event.keyCode == 13) {
        buscarProduto();
    }
});

$("#btnBuscarCliente").click(function() {
    buscarCliente();
});

$("#btnBuscarProduto").click(function() {
    buscarProduto();
});

function buscarCliente()
{
    $("#itemResultadoBusca").html("");
    $("#errorLoadCliente").hide();
    $("#buscaClienteload").show();


    $.ajax({
        type: "post",
        dataType: "json",
        url: rootUrl + "cliente/search",
        data: JSON.stringify({busca: $("#inputBuscarCliente").val()}),
        success: function(data) {
            $("#buscaClienteload").hide();

            data.result.forEach(function(cliente) {
                $("#itemResultadoBusca").append("<li><a class='itemClienteResult' href='#' data-nome='" + cliente.nome + "' data-id=" + cliente.id + " data-cpf='" + cliente.cpf + "'>" + cliente.nome + " - " + cliente.cpf + "</a></li>");
            });

        },
        error: function(result) {
            $("#buscaClienteload").hide();
            $("#errorLoadCliente").html(getErrorMessage(result.responseText));
            $("#errorLoadCliente").show();
        }
    });

}

function buscarProduto()
{
    $("#itemResultadoBuscaProduto").html("");
    $("#errorLoadProduto").hide();
    $("#buscaProdutoload").show();


    $.ajax({
        type: "post",
        dataType: "json",
        url: rootUrl + "produto/search",
        data: JSON.stringify({busca: $("#inputBuscarProduto").val()}),
        success: function(data) {
            $("#buscaProdutoload").hide();

            data.result.forEach(function(produto) {
                $("#itemResultadoBuscaProduto").append("<li><a class='itemProdutoResult' href='#' data-preco='" + produto.precoUnitario + "' data-nome='" + produto.nome + "' data-id=" + produto.id + " data-cpf='" + produto.codigo + "'>" + produto.nome + " - " + produto.codigo + " - " + produto.precoUnitario + "</a></li>");
            });

        },
        error: function(result) {
            $("#buscaProdutoload").hide();
            $("#errorLoadProduto").html(getErrorMessage(result.responseText));
            $("#errorLoadProduto").show();
        }
    });

}

$(".itemClienteResult").live("click", function() {
    $("#hiddenIdCliente").val($(this).attr("data-id"));
    $("#inputNomeCliente").val($(this).attr("data-nome"));
    $("#inputCpfCliente").val($(this).attr("data-cpf"));

    $("#inputNomeCliente").attr('disabled', 'disabled');
    $("#inputCpfCliente").attr('disabled', 'disabled');
    $("#btnNovoCliente").addClass("disabled").removeClass("btn-primary");

    $("#okCliente").show();

    $("#clienteModal").modal("hide");
});

$(".itemProdutoResult").live("click", function() {
    $("#hiddenIdProduto").val($(this).attr("data-id"));
    $("#hiddenPrecoProduto").val($(this).attr("data-preco"));
    $("#inputNomeProduto").val($(this).attr("data-nome"));
    $("#inputCodigoProduto").val($(this).attr("data-codigo"));

    $("#spanPrecoProduto").html("R$ " + $(this).attr("data-preco"));

    $("#inputNomeProduto").attr('disabled', 'disabled');
    $("#inputCodigoProduto").attr('disabled', 'disabled');

    $("#okProduto").show();

    $("#errorProduto").hide();

    $("#produtoModal").modal("hide");
});

$("#inputData").change(function() {
    $("#okData").show();
});

$("#btnNovoCliente").click(function() {

    if ($("#inputNomeCliente").val().length > 0)
    {
        $("#errorNewCliente").hide();
        $("#newClienteload").show();

        $.ajax({
            type: "post",
            dataType: "json",
            url: rootUrl + "cliente/newFromVendas",
            data: JSON.stringify({nome: $("#inputNomeCliente").val(), cpf: $("#inputCpfCliente").val()}),
            success: function(data) {
                $("#newClienteload").hide();
                cliente = data.result;
                $("#hiddenIdCliente").val(cliente.id);
                $("#inputNomeCliente").attr('disabled', 'disabled');
                $("#inputCpfCliente").attr('disabled', 'disabled');
                $("#btnNovoCliente").addClass("disabled").removeClass("btn-primary");
                $("#okCliente").show();

            },
            error: function(result) {
                $("#newClienteload").hide();
                $("#errorNewCliente").html(getErrorMessage(result.responseText));
                $("#errorNewCliente").show();
            }
        });
    }
    else
    {
        $("#errorNewCliente").show();
        $("#errorNewCliente").html("Preencher nome e cpf");
    }
});



$("#btnAdcionarProduto").click(function() {

    $("#errorProduto").hide();

    if ($("#hiddenIdProduto").val() != 0)
    {

        $valido = true;
        //verifica se o item já nao esta cadastrado
        $(".itemProduto").map(function() {
            if ($(this).attr("data-id") == $("#hiddenIdProduto").val())
            {
                $valido = false;
                $("#errorProduto").show();
                $("#errorProduto").html("Este produto já consta na lista de produtos comprados");
                $(this).parent().removeClass("alert-success").addClass(".alert-danger");

            }
        });

        if ($valido)
        {


            $(".itensProduto").append('<div class="alert alert-success"><a class="close">×</a><span class="itemProduto" data-id=' + $("#hiddenIdProduto").val() + ' data-quantidade=' + $("#inputQuantidadeProduto").val() + ' data-preco="' + $("#hiddenPrecoProduto").val() + '"></span><strong>' + $("#inputNomeProduto").val() + '</strong><span class="pull-right">' + $("#inputQuantidadeProduto").val() + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R$ ' + $("#hiddenPrecoProduto").val() + '</span>');
            $("#hiddenIdProduto").val(0);
            $("#hiddenPrecoProduto").val(0);
            $("#inputNomeProduto").val("");
            $("#inputCodigoProduto").val("");
            $("#inputQuantidadeProduto").val(1);
            $("#inputNomeProduto").removeAttr('disabled');
            $("#inputCodigoProduto").removeAttr('disabled');
            $("#spanPrecoProduto").html("");

            $("#okProduto").hide();

            calculaTotal();

        }

    }
    else
    {
        $("#errorProduto").html("Selecione um item da busca de itens de produtos");
        $("#errorProduto").show();
    }

});

$(".close").live("click", function() {
    $(this).parent().remove();
    calculaTotal();
});

function calculaTotal() {

    $total = 0;

    $(".itemProduto").map(function() {
        $total += $(this).attr("data-preco") * $(this).attr("data-quantidade");
    });

    $(".totalValue").html($total);
}



